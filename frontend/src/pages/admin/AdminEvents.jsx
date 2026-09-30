import { useEffect, useState } from "react";

import {
  Plus,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  MapPin,
  Clock3,
  FileText,
  Search,
} from "lucide-react";

import Swal from "sweetalert2";

import { apiFetch } from "../../api/api";
import { getAdminEvents } from "../../api/adminApi";


/* =========================================================
   EMPTY FORM
========================================================= */

const emptyForm = {
  title: "",
  description: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  venue: "",
  registrationDeadline: "",
  status: "DRAFT",
};


/* =========================================================
   HELPER
========================================================= */

const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};


/* =========================================================
   COMPONENT
========================================================= */

function AdminEvents() {

  const [events, setEvents] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);


  /* =========================================================
     SEARCH / FILTER / PAGINATION
  ========================================================= */

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [page, setPage] = useState(0);

  // Always display maximum 10 records
  const size = 10;

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);


  /* =========================================================
     LOAD EVENTS
  ========================================================= */

  const loadEvents = async () => {

    try {

      setLoading(true);

      const data = await getAdminEvents({
        page,
        size,
        search,
        status,
      });

      setEvents(data.content || []);

      setTotalPages(data.totalPages || 0);

      setTotalElements(data.totalElements || 0);

    } catch (error) {

      console.error("Failed to load events:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to load events",
        text: error.message || "Something went wrong.",
      });

      setEvents([]);

      setTotalPages(0);

      setTotalElements(0);

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadEvents();

  }, [page, search, status]);


  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  /* =========================================================
     EVENT DATE CHANGE
  ========================================================= */

  const handleEventDateChange = (e) => {

    const selectedDate = e.target.value;

    setForm((prev) => ({

      ...prev,

      eventDate: selectedDate,

      /*
       * If the current registration deadline
       * is after the newly selected event date,
       * clear the registration deadline.
       */
      registrationDeadline:
        prev.registrationDeadline &&
        selectedDate &&
        prev.registrationDeadline > selectedDate
          ? ""
          : prev.registrationDeadline,
    }));
  };


  /* =========================================================
     CREATE FORM
  ========================================================= */

  const openCreateForm = () => {

    setForm(emptyForm);

    setEditingId(null);

    setShowForm(true);
  };


  /* =========================================================
     EDIT FORM
  ========================================================= */

  const openEditForm = (event) => {

    setEditingId(event.id);

    setForm({
      title: event.title || "",
      description: event.description || "",
      eventDate: event.eventDate || "",
      startTime: event.startTime || "",
      endTime: event.endTime || "",
      venue: event.venue || "",
      registrationDeadline: event.registrationDeadline || "",
      status: event.status || "DRAFT",
    });

    setShowForm(true);
  };


  /* =========================================================
     CLOSE FORM
  ========================================================= */

  const closeForm = () => {

    setForm(emptyForm);

    setEditingId(null);

    setShowForm(false);
  };


  /* =========================================================
     CREATE / UPDATE EVENT
  ========================================================= */

  const handleSubmit = async (e) => {

    e.preventDefault();


    /* -------------------------------------------------------
       TIME VALIDATION
    ------------------------------------------------------- */

    if (
      form.endTime &&
      form.startTime &&
      form.endTime <= form.startTime
    ) {

      Swal.fire({
        icon: "warning",
        title: "Invalid Time",
        text: "End time must be later than start time.",
      });

      return;
    }


    /* -------------------------------------------------------
       EVENT DATE VALIDATION
    ------------------------------------------------------- */

    if (form.eventDate && form.eventDate < getTodayDate()) {

      Swal.fire({
        icon: "warning",
        title: "Invalid Event Date",
        text: "Event date cannot be before today.",
      });

      return;
    }


    /* -------------------------------------------------------
       REGISTRATION DEADLINE VALIDATION
    ------------------------------------------------------- */

    if (
      form.registrationDeadline &&
      form.eventDate &&
      form.registrationDeadline > form.eventDate
    ) {

      Swal.fire({
        icon: "warning",
        title: "Invalid Registration Deadline",
        text: "Registration deadline cannot be after the event date.",
      });

      return;
    }


    /* -------------------------------------------------------
       REGISTRATION DEADLINE CANNOT BE BEFORE TODAY
    ------------------------------------------------------- */

    if (
      form.registrationDeadline &&
      form.registrationDeadline < getTodayDate()
    ) {

      Swal.fire({
        icon: "warning",
        title: "Invalid Registration Deadline",
        text: "Registration deadline cannot be before today.",
      });

      return;
    }


    try {

      setSaving(true);


      /* -------------------------------------------------------
         REQUEST PAYLOAD
      ------------------------------------------------------- */

      const payload = {

        title: form.title.trim(),

        description: form.description.trim(),

        eventDate: form.eventDate,

        startTime: form.startTime,

        endTime: form.endTime || null,

        venue: form.venue.trim(),

        registrationDeadline:
          form.registrationDeadline || null,

        status: form.status,
      };


      /* -------------------------------------------------------
         UPDATE
      ------------------------------------------------------- */

      if (editingId) {

        await apiFetch(`/admin/events/${editingId}`, {

          method: "PUT",

          body: JSON.stringify(payload),

        });

      }

      /* -------------------------------------------------------
         CREATE
      ------------------------------------------------------- */

      else {

        await apiFetch("/admin/events", {

          method: "POST",

          body: JSON.stringify(payload),

        });

      }


      /* -------------------------------------------------------
         SUCCESS
      ------------------------------------------------------- */

      await Swal.fire({

        icon: "success",

        title: editingId
          ? "Event Updated Successfully"
          : "Event Created Successfully",

        showConfirmButton: false,

        timer: 1500,

      });


      closeForm();

      await loadEvents();


    } catch (error) {

      console.error("Unable to save event:", error);

      Swal.fire({

        icon: "error",

        title: "Unable to save event",

        text:
          error.message ||
          "Something went wrong while saving the event.",

      });

    } finally {

      setSaving(false);

    }
  };


  /* =========================================================
     DELETE EVENT
  ========================================================= */

  const deleteEvent = async (id) => {

    const result = await Swal.fire({

      title: "Delete Event?",

      text: "This action cannot be undone.",

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#dc2626",

      cancelButtonColor: "#6b7280",

      confirmButtonText: "Yes, Delete",

      cancelButtonText: "Cancel",

    });


    if (!result.isConfirmed) {

      return;

    }


    try {

      await apiFetch(`/admin/events/${id}`, {

        method: "DELETE",

      });


      await Swal.fire({

        icon: "success",

        title: "Event Deleted",

        showConfirmButton: false,

        timer: 1200,

      });


      /*
       * If deleting the last item on a page,
       * move back one page.
       */

      if (events.length === 1 && page > 0) {

        setPage((previousPage) => previousPage - 1);

      } else {

        await loadEvents();

      }


    } catch (error) {

      Swal.fire({

        icon: "error",

        title: "Unable to delete event",

        text:
          error.message ||
          "Something went wrong.",

      });

    }
  };


  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearchChange = (e) => {

    setSearch(e.target.value);

    // Go back to first page when search changes
    setPage(0);
  };


  /* =========================================================
     STATUS FILTER
  ========================================================= */

  const handleStatusChange = (e) => {

    setStatus(e.target.value);

    // Go back to first page when filter changes
    setPage(0);
  };


  /* =========================================================
     PAGINATION
  ========================================================= */

  const goToPage = (pageNumber) => {

    if (
      pageNumber < 0 ||
      pageNumber >= totalPages
    ) {

      return;

    }

    setPage(pageNumber);
  };


  const startRecord =
    totalElements === 0
      ? 0
      : page * size + 1;


  const endRecord =
    Math.min(
      (page + 1) * size,
      totalElements
    );


  /* =========================================================
     UI
  ========================================================= */

  return (

    <div className="max-w-7xl mx-auto">


      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            Events
          </h1>

          <p className="text-gray-500 mt-1">
            Create and manage college events.
          </p>

        </div>


        {!showForm && (

          <button

            type="button"

            onClick={openCreateForm}

            className="
              inline-flex
              items-center
              justify-center
              gap-2
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-medium
              px-5
              py-3
              rounded-lg
              transition
            "
          >

            <Plus size={19} />

            Create Event

          </button>

        )}

      </div>


      {/* =====================================================
          CREATE / EDIT FORM
      ===================================================== */}

      {showForm && (

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-8">


          {/* -------------------------------------------------
              FORM HEADER
          ------------------------------------------------- */}

          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold text-gray-900">

                {editingId
                  ? "Edit Event"
                  : "Create New Event"}

              </h2>

              <p className="text-sm text-gray-500 mt-1">

                {editingId
                  ? "Update the event details below."
                  : "Enter the event details below."}

              </p>

            </div>


            <button

              type="button"

              onClick={closeForm}

              className="
                p-2
                rounded-lg
                text-gray-500
                hover:bg-gray-100
                hover:text-gray-700
                transition
              "
            >

              <X size={21} />

            </button>

          </div>


          {/* -------------------------------------------------
              FORM
          ------------------------------------------------- */}

          <form onSubmit={handleSubmit}>

            <div className="p-6 space-y-8">


              {/* =================================================
                  EVENT INFORMATION
              ================================================= */}

              <section>

                <div className="flex items-center gap-2 mb-5">

                  <FileText
                    size={19}
                    className="text-blue-600"
                  />

                  <div>

                    <h3 className="font-semibold text-gray-900">
                      Event Information
                    </h3>

                    <p className="text-sm text-gray-500 mt-0.5">
                      Enter the basic information about your event.
                    </p>

                  </div>

                </div>


                <div className="space-y-5">


                  {/* Event Title */}

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                      Event Title

                      <span className="text-red-500 ml-1">
                        *
                      </span>

                    </label>


                    <input

                      type="text"

                      name="title"

                      value={form.title}

                      onChange={handleChange}

                      placeholder="Enter event title"

                      maxLength={100}

                      required

                      className="
                        w-full
                        px-4
                        py-3
                        border
                        border-gray-300
                        rounded-lg
                        bg-white
                        focus:ring-2
                        focus:ring-blue-500
                        focus:border-blue-500
                        outline-none
                        transition
                      "
                    />

                  </div>


                  {/* Description */}

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                      Description

                      <span className="text-red-500 ml-1">
                        *
                      </span>

                    </label>


                    <textarea

                      name="description"

                      value={form.description}

                      onChange={handleChange}

                      placeholder="Describe the event, activities, and important information..."

                      rows={5}

                      maxLength={1000}

                      required

                      className="
                        w-full
                        px-4
                        py-3
                        border
                        border-gray-300
                        rounded-lg
                        bg-white
                        focus:ring-2
                        focus:ring-blue-500
                        focus:border-blue-500
                        outline-none
                        transition
                        resize-none
                      "
                    />


                    <p className="text-xs text-gray-400 mt-1 text-right">

                      {form.description.length}/1000

                    </p>

                  </div>

                </div>

              </section>


              {/* =================================================
                  SCHEDULE
              ================================================= */}

              <section>

                <div className="flex items-center gap-2 mb-5">

                  <CalendarDays
                    size={19}
                    className="text-blue-600"
                  />

                  <div>

                    <h3 className="font-semibold text-gray-900">
                      Schedule
                    </h3>

                    <p className="text-sm text-gray-500 mt-0.5">
                      Set the event date, registration deadline, and time.
                    </p>

                  </div>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                  {/* =================================================
                      EVENT DATE
                  ================================================= */}

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                      Event Date

                      <span className="text-red-500 ml-1">
                        *
                      </span>

                    </label>


                    <div className="relative">

                      <CalendarDays
                        size={18}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                          text-gray-400
                          pointer-events-none
                        "
                      />


                      <input

                        type="date"

                        name="eventDate"

                        value={form.eventDate}

                        min={getTodayDate()}

                        onChange={handleEventDateChange}

                        required

                        className="
                          w-full
                          pl-10
                          pr-4
                          py-3
                          border
                          border-gray-300
                          rounded-lg
                          bg-white
                          focus:ring-2
                          focus:ring-blue-500
                          focus:border-blue-500
                          outline-none
                          transition
                        "
                      />

                    </div>


                    <p className="text-xs text-gray-500 mt-1.5">

                      Select the date when the event will take place.

                    </p>

                  </div>


                  {/* =================================================
                      REGISTRATION DEADLINE
                  ================================================= */}

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                      Registration Deadline

                    </label>


                    <div className="relative">

                      <CalendarDays
                        size={18}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                          text-gray-400
                          pointer-events-none
                        "
                      />


                      <input

                        type="date"

                        name="registrationDeadline"

                        value={form.registrationDeadline}

                        min={getTodayDate()}

                        max={
                          form.eventDate || undefined
                        }

                        onChange={handleChange}

                        disabled={!form.eventDate}

                        className={`
                          w-full
                          pl-10
                          pr-4
                          py-3
                          border
                          border-gray-300
                          rounded-lg
                          outline-none
                          transition

                          ${
                            !form.eventDate
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          }
                        `}
                      />

                    </div>


                    <p className="text-xs text-gray-500 mt-1.5">

                      {form.eventDate

                        ? `Registration must close on or before ${form.eventDate}.`

                        : "Select the event date first."}

                    </p>

                  </div>


                  {/* =================================================
                      START TIME
                  ================================================= */}

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                      Start Time

                      <span className="text-red-500 ml-1">
                        *
                      </span>

                    </label>


                    <div className="relative">

                      <Clock3
                        size={18}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                          text-gray-400
                          pointer-events-none
                        "
                      />


                      <input

                        type="time"

                        name="startTime"

                        value={form.startTime}

                        onChange={handleChange}

                        required

                        className="
                          w-full
                          pl-10
                          pr-4
                          py-3
                          border
                          border-gray-300
                          rounded-lg
                          bg-white
                          focus:ring-2
                          focus:ring-blue-500
                          focus:border-blue-500
                          outline-none
                          transition
                        "
                      />

                    </div>

                  </div>


                  {/* =================================================
                      END TIME
                  ================================================= */}

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                      End Time

                    </label>


                    <div className="relative">

                      <Clock3
                        size={18}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                          text-gray-400
                          pointer-events-none
                        "
                      />


                      <input

                        type="time"

                        name="endTime"

                        value={form.endTime}

                        onChange={handleChange}

                        className="
                          w-full
                          pl-10
                          pr-4
                          py-3
                          border
                          border-gray-300
                          rounded-lg
                          bg-white
                          focus:ring-2
                          focus:ring-blue-500
                          focus:border-blue-500
                          outline-none
                          transition
                        "
                      />

                    </div>

                  </div>

                </div>

              </section>


              {/* =================================================
                  LOCATION
              ================================================= */}

              <section>

                <div className="flex items-center gap-2 mb-5">

                  <MapPin
                    size={19}
                    className="text-blue-600"
                  />

                  <div>

                    <h3 className="font-semibold text-gray-900">
                      Location
                    </h3>

                    <p className="text-sm text-gray-500 mt-0.5">
                      Enter where the event will be conducted.
                    </p>

                  </div>

                </div>


                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">

                    Venue

                    <span className="text-red-500 ml-1">
                      *
                    </span>

                  </label>


                  <input

                    type="text"

                    name="venue"

                    value={form.venue}

                    onChange={handleChange}

                    placeholder="e.g. Main Auditorium"

                    maxLength={150}

                    required

                    className="
                      w-full
                      px-4
                      py-3
                      border
                      border-gray-300
                      rounded-lg
                      bg-white
                      focus:ring-2
                      focus:ring-blue-500
                      focus:border-blue-500
                      outline-none
                      transition
                    "
                  />


                  <p className="text-xs text-gray-500 mt-1.5">

                    Enter the name of the hall, auditorium,
                    classroom, or venue.

                  </p>

                </div>

              </section>


              {/* =================================================
                  PUBLISHING
              ================================================= */}

              <section>

                <div className="flex items-center gap-2 mb-5">

                  <Clock3
                    size={19}
                    className="text-blue-600"
                  />

                  <div>

                    <h3 className="font-semibold text-gray-900">
                      Publishing
                    </h3>

                    <p className="text-sm text-gray-500 mt-0.5">
                      Choose the current status of this event.
                    </p>

                  </div>

                </div>


                <div className="max-w-md">

                  <label className="block text-sm font-medium text-gray-700 mb-2">

                    Event Status

                    <span className="text-red-500 ml-1">
                      *
                    </span>

                  </label>


                  <select

                    name="status"

                    value={form.status}

                    onChange={handleChange}

                    className="
                      w-full
                      px-4
                      py-3
                      border
                      border-gray-300
                      rounded-lg
                      bg-white
                      focus:ring-2
                      focus:ring-blue-500
                      focus:border-blue-500
                      outline-none
                      transition
                    "
                  >

                    <option value="DRAFT">
                      Draft
                    </option>

                    <option value="PUBLISHED">
                      Published
                    </option>

                    <option value="CANCELLED">
                      Cancelled
                    </option>

                    <option value="COMPLETED">
                      Completed
                    </option>

                  </select>

                </div>

              </section>

            </div>


            {/* =================================================
                FORM FOOTER
            ================================================= */}

            <div className="
              px-6
              py-4
              bg-gray-50
              border-t
              border-gray-200
              flex
              flex-col-reverse
              sm:flex-row
              sm:justify-end
              gap-3
            ">


              {/* Cancel */}

              <button

                type="button"

                onClick={closeForm}

                disabled={saving}

                className="
                  px-6
                  py-3
                  border
                  border-gray-300
                  bg-white
                  text-gray-700
                  font-medium
                  rounded-lg
                  hover:bg-gray-50
                  transition
                  disabled:opacity-50
                "
              >

                Cancel

              </button>


              {/* Submit */}

              <button

                type="submit"

                disabled={saving}

                className="
                  px-6
                  py-3
                  bg-blue-600
                  text-white
                  font-medium
                  rounded-lg
                  hover:bg-blue-700
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >

                {saving

                  ? "Saving..."

                  : editingId
                    ? "Update Event"
                    : "Create Event"}

              </button>

            </div>

          </form>

        </div>

      )}


      {/* =====================================================
          EVENTS TABLE
      ===================================================== */}

      {!showForm && (

        <div className="
          bg-white
          border
          border-gray-200
          rounded-xl
          shadow-sm
          overflow-hidden
        ">


          {/* -------------------------------------------------
              TABLE HEADER
          ------------------------------------------------- */}

          <div className="px-6 py-5 border-b border-gray-200">

            <div className="
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-4
            ">


              <div>

                <h2 className="text-lg font-semibold text-gray-900">
                  All Events
                </h2>

                <p className="text-sm text-gray-500 mt-1">

                  {totalElements} event
                  {totalElements !== 1 ? "s" : ""}

                </p>

              </div>


              {/* -------------------------------------------------
                  SEARCH + FILTER
              ------------------------------------------------- */}

              <div className="flex flex-col sm:flex-row gap-3">


                {/* Search */}

                <div className="relative">

                  <Search
                    size={18}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />


                  <input

                    type="text"

                    value={search}

                    onChange={handleSearchChange}

                    placeholder="Search events..."

                    className="
                      w-full
                      sm:w-72
                      pl-10
                      pr-4
                      py-2.5
                      border
                      border-gray-300
                      rounded-lg
                      focus:ring-2
                      focus:ring-blue-500
                      focus:border-blue-500
                      outline-none
                    "
                  />

                </div>


                {/* Status Filter */}

                <select

                  value={status}

                  onChange={handleStatusChange}

                  className="
                    w-full
                    sm:w-48
                    px-4
                    py-2.5
                    border
                    border-gray-300
                    rounded-lg
                    bg-white
                    focus:ring-2
                    focus:ring-blue-500
                    focus:border-blue-500
                    outline-none
                  "
                >

                  <option value="">
                    All Status
                  </option>

                  <option value="DRAFT">
                    Draft
                  </option>

                  <option value="PUBLISHED">
                    Published
                  </option>

                  <option value="CANCELLED">
                    Cancelled
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>

                </select>

              </div>

            </div>

          </div>


          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (

            <div className="p-10 text-center text-gray-500">

              Loading events...

            </div>

          ) : events.length === 0 ? (


            /* =================================================
               EMPTY STATE
            ================================================= */

            <div className="p-12 text-center">

              <CalendarDays
                size={45}
                className="mx-auto text-gray-300 mb-3"
              />

              <h3 className="font-medium text-gray-700">
                No events found
              </h3>

              <p className="text-sm text-gray-500 mt-1">

                {search || status

                  ? "Try changing your search or filter."

                  : "Create your first event to get started."}

              </p>

            </div>


          ) : (


            /* =================================================
               TABLE + PAGINATION
            ================================================= */

            <>


              {/* =================================================
                  TABLE
              ================================================= */}

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-gray-50 border-b">

                    <tr>

                      <th className="
                        text-left
                        px-6
                        py-4
                        text-sm
                        font-semibold
                        text-gray-600
                      ">
                        Event
                      </th>


                      <th className="
                        text-left
                        px-6
                        py-4
                        text-sm
                        font-semibold
                        text-gray-600
                      ">
                        Date
                      </th>


                      <th className="
                        text-left
                        px-6
                        py-4
                        text-sm
                        font-semibold
                        text-gray-600
                      ">
                        Venue
                      </th>


                      <th className="
                        text-left
                        px-6
                        py-4
                        text-sm
                        font-semibold
                        text-gray-600
                      ">
                        Status
                      </th>


                      <th className="
                        text-right
                        px-6
                        py-4
                        text-sm
                        font-semibold
                        text-gray-600
                      ">
                        Actions
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {events.map((event) => (

                      <tr

                        key={event.id}

                        className="
                          border-b
                          last:border-b-0
                          hover:bg-gray-50
                        "
                      >


                        {/* =================================================
                            EVENT
                        ================================================= */}

                        <td className="px-6 py-4">

                          <p className="font-medium text-gray-900">
                            {event.title}
                          </p>


                          {/* Description Hover */}

                          <div className="
                            relative
                            group
                            mt-1
                            max-w-md
                          ">

                            <p className="
                              text-sm
                              text-gray-500
                              truncate
                              cursor-help
                            ">
                              {event.description}
                            </p>


                            {/* Full Description */}

                            <div className="
                              absolute
                              left-0
                              top-full
                              z-50
                              hidden
                              group-hover:block
                              w-96
                              mt-2
                            ">

                              <div className="
                                bg-gray-900
                                text-white
                                text-sm
                                rounded-lg
                                shadow-xl
                                p-4
                                whitespace-normal
                                break-words
                              ">

                                {event.description}

                              </div>

                            </div>

                          </div>

                        </td>


                        {/* =================================================
                            DATE
                        ================================================= */}

                        <td className="
                          px-6
                          py-4
                          text-sm
                          text-gray-600
                          whitespace-nowrap
                        ">

                          {event.eventDate}

                        </td>


                        {/* =================================================
                            VENUE
                        ================================================= */}

                        <td className="
                          px-6
                          py-4
                          text-sm
                          text-gray-600
                        ">

                          {event.venue}

                        </td>


                        {/* =================================================
                            STATUS
                        ================================================= */}

                        <td className="px-6 py-4">

                          <span

                            className={`
                              inline-flex
                              px-3
                              py-1
                              rounded-full
                              text-xs
                              font-medium

                              ${
                                event.status === "PUBLISHED"

                                  ? "bg-green-100 text-green-700"

                                  : event.status === "CANCELLED"

                                    ? "bg-red-100 text-red-700"

                                    : event.status === "COMPLETED"

                                      ? "bg-purple-100 text-purple-700"

                                      : "bg-yellow-100 text-yellow-700"
                              }
                            `}
                          >

                            {event.status}

                          </span>

                        </td>


                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <td className="px-6 py-4">

                          <div className="
                            flex
                            justify-end
                            gap-2
                          ">


                            {/* Edit */}

                            <button

                              type="button"

                              onClick={() =>
                                openEditForm(event)
                              }

                              className="
                                p-2
                                rounded-lg
                                bg-yellow-50
                                text-yellow-700
                                hover:bg-yellow-100
                                transition
                              "

                              title="Edit"
                            >

                              <Pencil size={17} />

                            </button>


                            {/* Delete */}

                            <button

                              type="button"

                              onClick={() =>
                                deleteEvent(event.id)
                              }

                              className="
                                p-2
                                rounded-lg
                                bg-red-50
                                text-red-700
                                hover:bg-red-100
                                transition
                              "

                              title="Delete"
                            >

                              <Trash2 size={17} />

                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>


              {/* =================================================
                  PAGINATION
              ================================================= */}

              {totalPages > 0 && (

                <div className="
                  px-6
                  py-4
                  border-t
                  border-gray-200
                  bg-gray-50
                ">

                  <div className="
                    flex
                    flex-col
                    sm:flex-row
                    items-center
                    justify-between
                    gap-4
                  ">


                    {/* Record Count */}

                    <p className="text-sm text-gray-600">

                      Showing{" "}

                      <span className="font-medium">
                        {startRecord}
                      </span>

                      {" "}to{" "}

                      <span className="font-medium">
                        {endRecord}
                      </span>

                      {" "}of{" "}

                      <span className="font-medium">
                        {totalElements}
                      </span>

                      {" "}events

                    </p>
                    {/* Pagination */}

                    <div className="
                      flex
                      items-center
                      gap-1
                      flex-wrap
                      justify-center
                    ">
                      {/* Previous */}
                      <button
                        type="button"
                        disabled={page === 0}
                        onClick={() =>
                          goToPage(page - 1)
                        }

                        className="
                          px-3
                          py-2
                          border
                          border-gray-300
                          rounded-lg
                          text-sm
                          font-medium
                          text-gray-700
                          bg-white
                          hover:bg-gray-100
                          disabled:opacity-50
                          disabled:cursor-not-allowed
                        "
                      >
                        Previous
                      </button>

                      {/* Page Numbers */}

                      {Array.from(
                        { length: totalPages },
                        (_, index) => index
                      ).map((pageNumber) => (

                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() =>
                            goToPage(pageNumber)
                          }

                          className={`
                            min-w-10
                            px-3
                            py-2
                            border
                            rounded-lg
                            text-sm
                            font-medium

                            ${
                              page === pageNumber
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            }
                          `}
                        >
                          {pageNumber + 1}
                        </button>

                      ))}

                      {/* Next */}

                      <button
                        type="button"
                        disabled={
                          page >= totalPages - 1
                        }
                        onClick={() =>
                          goToPage(page + 1)
                        }

                        className="
                          px-3
                          py-2
                          border
                          border-gray-300
                          rounded-lg
                          text-sm
                          font-medium
                          text-gray-700
                          bg-white
                          hover:bg-gray-100
                          disabled:opacity-50
                          disabled:cursor-not-allowed
                        "
                      >
                        Next
                      </button>

                    </div>

                  </div>

                </div>

              )}

            </>

          )}

        </div>
      )}
    </div>
  );
}
export default AdminEvents;