import { useEffect, useState } from "react";

import {
  Plus,
  Pencil,
  Trash2,
  X,
  Users,
  Mail,
  Phone,
  UserRound,
  Search,
  Eye,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

import Swal from "sweetalert2";

import { apiFetch } from "../../api/api";

/* =========================================================
   EMPTY FORM
========================================================= */

const emptyForm = {
  name: "",
  description: "",
  facultyCoordinator: "",
  contactEmail: "",
  contactPhone: "",
  active: true,
};

/* =========================================================
   COMPONENT
========================================================= */

function AdminClubs() {
  const [clubs, setClubs] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  // View drawer
  const [viewClub, setViewClub] = useState(null);

  /* =========================================================
     LOAD CLUBS
  ========================================================= */

  const loadClubs = async () => {
    try {
      setLoading(true);

      const data = await apiFetch("/admin/clubs");

      setClubs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load clubs:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to load clubs",
        text: error.message || "Something went wrong.",
      });

      setClubs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClubs();
  }, []);

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* =========================================================
     OPEN CREATE FORM
  ========================================================= */

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  /* =========================================================
     EDIT CLUB
  ========================================================= */

  const editClub = (club) => {
    setEditingId(club.id);

    setForm({
      name: club.name || "",
      description: club.description || "",
      facultyCoordinator:
        club.facultyCoordinator || "",
      contactEmail:
        club.contactEmail || "",
      contactPhone:
        club.contactPhone || "",
      active:
        club.active ?? true,
    });

    setShowForm(true);
  };

  /* =========================================================
     RESET FORM
  ========================================================= */

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  /* =========================================================
     SUBMIT FORM
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* -------------------------------------------------------
       BASIC VALIDATION
    ------------------------------------------------------- */

    if (!form.name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Club Name Required",
        text: "Please enter the club name.",
      });

      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),

        description:
          form.description.trim(),

        facultyCoordinator:
          form.facultyCoordinator.trim(),

        contactEmail:
          form.contactEmail.trim(),

        contactPhone:
          form.contactPhone.trim(),

        active:
          form.active,
      };

      /* -------------------------------------------------------
         UPDATE
      ------------------------------------------------------- */

      if (editingId) {
        await apiFetch(
          `/admin/clubs/${editingId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
      }

      /* -------------------------------------------------------
         CREATE
      ------------------------------------------------------- */

      else {
        await apiFetch(
          "/admin/clubs",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );
      }

      /* -------------------------------------------------------
         SUCCESS
      ------------------------------------------------------- */

      await Swal.fire({
        icon: "success",

        title: editingId
          ? "Club Updated Successfully"
          : "Club Created Successfully",

        showConfirmButton: false,

        timer: 1500,
      });

      resetForm();

      await loadClubs();

    } catch (error) {
      console.error(
        "Unable to save club:",
        error
      );

      Swal.fire({
        icon: "error",

        title: "Unable to save club",

        text:
          error.message ||
          "Something went wrong while saving the club.",
      });
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     DELETE CLUB
  ========================================================= */

  const deleteClub = async (id) => {
    const result = await Swal.fire({
      title: "Delete Club?",

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
      await apiFetch(
        `/admin/clubs/${id}`,
        {
          method: "DELETE",
        }
      );

      await Swal.fire({
        icon: "success",

        title: "Club Deleted",

        showConfirmButton: false,

        timer: 1200,
      });

      await loadClubs();

    } catch (error) {
      Swal.fire({
        icon: "error",

        title: "Unable to delete club",

        text:
          error.message ||
          "Something went wrong.",
      });
    }
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredClubs = clubs.filter((club) => {
    const searchValue =
      search.trim().toLowerCase();

    if (!searchValue) {
      return true;
    }

    return (
      club.name
        ?.toLowerCase()
        .includes(searchValue)

      ||

      club.facultyCoordinator
        ?.toLowerCase()
        .includes(searchValue)

      ||

      club.contactEmail
        ?.toLowerCase()
        .includes(searchValue)

      ||

      club.contactPhone
        ?.toLowerCase()
        .includes(searchValue)

      ||

      club.description
        ?.toLowerCase()
        .includes(searchValue)
    );
  });

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="max-w-7xl mx-auto">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="
        flex
        flex-col
        sm:flex-row
        sm:items-center
        sm:justify-between
        gap-4
        mb-6
      ">

        <div>

          <h1 className="
            text-2xl
            font-semibold
            text-gray-900
          ">
            Clubs
          </h1>

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
              bg-teal-700
              hover:bg-teal-800
              text-white
              text-sm
              font-medium
              px-4
              py-2.5
              rounded-md
              transition
            "
          >
            <Plus size={18} />
            New Club
          </button>
        )}

      </div>


      {/* =====================================================
          CREATE / EDIT FORM
      ===================================================== */}

      {showForm && (

        <div className="
          bg-white
          border
          border-gray-300
          rounded-lg
          overflow-hidden
          mb-6
        ">

          {/* FORM HEADER */}

          <div className="
            px-6
            py-4
            border-b
            border-gray-300
            flex
            items-center
            justify-between
          ">

            <div>

              <h2 className="
                text-lg
                font-semibold
                text-gray-900
              ">
                {editingId
                  ? "Edit Club"
                  : "Create New Club"}
              </h2>

              <p className="
                text-sm
                text-gray-500
                mt-1
              ">
                {editingId
                  ? "Update the club details below."
                  : "Enter the club details below."}
              </p>

            </div>

            <button
              type="button"
              onClick={resetForm}
              disabled={saving}
              className="
                w-9
                h-9
                flex
                items-center
                justify-center
                rounded-md
                text-gray-500
                hover:bg-gray-100
                hover:text-gray-700
                transition
                disabled:opacity-50
              "
            >
              <X size={20} />
            </button>

          </div>


          {/* FORM */}

          <form onSubmit={handleSubmit}>

            <div className="
              p-6
              space-y-8
            ">

              {/* CLUB INFORMATION */}

              <section>

                <div className="
                  flex
                  items-center
                  gap-2
                  mb-5
                ">

                  <Users
                    size={19}
                    className="text-teal-700"
                  />

                  <div>

                    <h3 className="
                      font-semibold
                      text-gray-900
                    ">
                      Club Information
                    </h3>

                    <p className="
                      text-sm
                      text-gray-500
                      mt-0.5
                    ">
                      Enter the basic information about the club.
                    </p>

                  </div>

                </div>


                <div className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-5
                ">

                  {/* CLUB NAME */}

                  <div>

                    <label className="
                      block
                      text-sm
                      font-medium
                      text-gray-700
                      mb-2
                    ">
                      Club Name
                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Coding Club"
                      maxLength={100}
                      required
                      className="
                        w-full
                        px-4
                        py-2.5
                        border
                        border-gray-300
                        rounded-md
                        bg-white
                        focus:ring-1
                        focus:ring-teal-600
                        focus:border-teal-600
                        outline-none
                        transition
                      "
                    />

                  </div>


                  {/* FACULTY COORDINATOR */}

                  <div>

                    <label className="
                      block
                      text-sm
                      font-medium
                      text-gray-700
                      mb-2
                    ">
                      Faculty Coordinator
                    </label>

                    <div className="relative">

                      <UserRound
                        size={17}
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
                        type="text"
                        name="facultyCoordinator"
                        value={
                          form.facultyCoordinator
                        }
                        onChange={handleChange}
                        placeholder="Enter faculty name"
                        maxLength={100}
                        className="
                          w-full
                          pl-10
                          pr-4
                          py-2.5
                          border
                          border-gray-300
                          rounded-md
                          bg-white
                          focus:ring-1
                          focus:ring-teal-600
                          focus:border-teal-600
                          outline-none
                          transition
                        "
                      />

                    </div>

                  </div>


                  {/* DESCRIPTION */}

                  <div className="md:col-span-2">

                    <label className="
                      block
                      text-sm
                      font-medium
                      text-gray-700
                      mb-2
                    ">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Describe the club and its activities..."
                      rows={5}
                      maxLength={1000}
                      className="
                        w-full
                        px-4
                        py-2.5
                        border
                        border-gray-300
                        rounded-md
                        bg-white
                        focus:ring-1
                        focus:ring-teal-600
                        focus:border-teal-600
                        outline-none
                        transition
                        resize-none
                      "
                    />

                    <p className="
                      text-xs
                      text-gray-400
                      mt-1
                      text-right
                    ">
                      {form.description.length}/1000
                    </p>

                  </div>

                </div>

              </section>


              {/* CONTACT INFORMATION */}

              <section>

                <div className="
                  flex
                  items-center
                  gap-2
                  mb-5
                ">

                  <Mail
                    size={19}
                    className="text-teal-700"
                  />

                  <div>

                    <h3 className="
                      font-semibold
                      text-gray-900
                    ">
                      Contact Information
                    </h3>

                    <p className="
                      text-sm
                      text-gray-500
                      mt-0.5
                    ">
                      Add contact details for students.
                    </p>

                  </div>

                </div>


                <div className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-5
                ">

                  {/* EMAIL */}

                  <div>

                    <label className="
                      block
                      text-sm
                      font-medium
                      text-gray-700
                      mb-2
                    ">
                      Contact Email
                    </label>

                    <div className="relative">

                      <Mail
                        size={17}
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
                        type="email"
                        name="contactEmail"
                        value={
                          form.contactEmail
                        }
                        onChange={handleChange}
                        placeholder="club@college.edu"
                        className="
                          w-full
                          pl-10
                          pr-4
                          py-2.5
                          border
                          border-gray-300
                          rounded-md
                          bg-white
                          focus:ring-1
                          focus:ring-teal-600
                          focus:border-teal-600
                          outline-none
                          transition
                        "
                      />

                    </div>

                  </div>


                  {/* PHONE */}

                  <div>

                    <label className="
                      block
                      text-sm
                      font-medium
                      text-gray-700
                      mb-2
                    ">
                      Contact Phone
                    </label>

                    <div className="relative">

                      <Phone
                        size={17}
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
                        type="tel"
                        name="contactPhone"
                        value={
                          form.contactPhone
                        }
                        onChange={handleChange}
                        placeholder="Enter contact number"
                        maxLength={20}
                        className="
                          w-full
                          pl-10
                          pr-4
                          py-2.5
                          border
                          border-gray-300
                          rounded-md
                          bg-white
                          focus:ring-1
                          focus:ring-teal-600
                          focus:border-teal-600
                          outline-none
                          transition
                        "
                      />

                    </div>

                  </div>

                </div>

              </section>


              {/* STATUS */}

              <section>

                <div className="
                  flex
                  items-center
                  gap-2
                  mb-5
                ">

                  <Users
                    size={19}
                    className="text-teal-700"
                  />

                  <div>

                    <h3 className="
                      font-semibold
                      text-gray-900
                    ">
                      Club Status
                    </h3>

                    <p className="
                      text-sm
                      text-gray-500
                      mt-0.5
                    ">
                      Choose whether this club is currently active.
                    </p>

                  </div>

                </div>


                <div className="max-w-md">

                  <label className="
                    block
                    text-sm
                    font-medium
                    text-gray-700
                    mb-2
                  ">
                    Status
                  </label>

                  <select
                    name="active"
                    value={
                      form.active
                        ? "true"
                        : "false"
                    }
                    onChange={(e) => {
                      setForm((previous) => ({
                        ...previous,
                        active:
                          e.target.value === "true",
                      }));
                    }}
                    className="
                      w-full
                      px-4
                      py-2.5
                      border
                      border-gray-300
                      rounded-md
                      bg-white
                      focus:ring-1
                      focus:ring-teal-600
                      focus:border-teal-600
                      outline-none
                      transition
                    "
                  >
                    <option value="true">
                      Active
                    </option>

                    <option value="false">
                      Inactive
                    </option>
                  </select>

                </div>

              </section>

            </div>


            {/* FORM FOOTER */}

            <div className="
              px-6
              py-4
              bg-gray-50
              border-t
              border-gray-300
              flex
              flex-col-reverse
              sm:flex-row
              sm:justify-end
              gap-3
            ">

              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="
                  px-5
                  py-2.5
                  border
                  border-gray-400
                  bg-white
                  text-gray-700
                  text-sm
                  font-medium
                  rounded-md
                  hover:bg-gray-100
                  transition
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="
                  px-5
                  py-2.5
                  bg-teal-700
                  text-white
                  text-sm
                  font-medium
                  rounded-md
                  hover:bg-teal-800
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Club"
                    : "Create Club"}
              </button>

            </div>

          </form>

        </div>

      )}


      {/* =====================================================
          CLUB TABLE
      ===================================================== */}

      {!showForm && (

        <div className="
          bg-white
          border
          border-gray-300
          rounded-lg
          overflow-hidden
        ">

          {/* SEARCH */}

          <div className="
            px-4
            py-4
            border-b
            border-gray-300
          ">

            <div className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-3
            ">

              <div className="relative w-full sm:w-96">

                <Search
                  size={18}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-500
                  "
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search clubs"
                  className="
                    w-full
                    h-10
                    pl-10
                    pr-4
                    border
                    border-gray-400
                    rounded-md
                    bg-white
                    text-sm
                    text-gray-800
                    placeholder:text-gray-500
                    outline-none
                    focus:border-teal-600
                    focus:ring-1
                    focus:ring-teal-600
                  "
                />

              </div>

            </div>

          </div>


          {/* LOADING */}

          {loading ? (

            <div className="
              py-16
              text-center
              text-sm
              text-gray-500
            ">
              Loading clubs...
            </div>

          ) : filteredClubs.length === 0 ? (

            <div className="
              py-16
              text-center
            ">

              <Users
                size={42}
                className="
                  mx-auto
                  text-gray-300
                  mb-3
                "
              />

              <h3 className="
                text-sm
                font-semibold
                text-gray-700
              ">
                No clubs found
              </h3>

              <p className="
                text-sm
                text-gray-500
                mt-1
              ">
                {search
                  ? "Try changing your search."
                  : "Create your first club to get started."}
              </p>

            </div>

          ) : (

            <>
              {/* TABLE */}

              <div className="overflow-x-auto">

                <table className="
                  w-full
                  border-collapse
                ">

                  <thead>

                    <tr className="
                      bg-white
                      border-b
                      border-gray-400
                    ">

                      <th className="
                        px-4
                        py-3
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-gray-600
                        whitespace-nowrap
                      ">
                        <div className="
                          flex
                          items-center
                          gap-1
                        ">
                          Club Name
                          <span className="text-gray-400">
                            ↕
                          </span>
                        </div>
                      </th>


                      <th className="
                        px-4
                        py-3
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-gray-600
                        whitespace-nowrap
                      ">
                        <div className="
                          flex
                          items-center
                          gap-1
                        ">
                          Coordinator
                          <span className="text-gray-400">
                            ↕
                          </span>
                        </div>
                      </th>


                      <th className="
                        px-4
                        py-3
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-gray-600
                        whitespace-nowrap
                      ">
                        <div className="
                          flex
                          items-center
                          gap-1
                        ">
                          Contact
                          <span className="text-gray-400">
                            ↕
                          </span>
                        </div>
                      </th>


                      <th className="
                        px-4
                        py-3
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-gray-600
                        whitespace-nowrap
                      ">
                        <div className="
                          flex
                          items-center
                          gap-1
                        ">
                          Status
                          <span className="text-gray-400">
                            ↕
                          </span>
                        </div>
                      </th>


                      <th className="
                        px-4
                        py-3
                        text-right
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-gray-600
                        whitespace-nowrap
                      ">
                        Actions
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredClubs.map((club) => (

                      <tr
                        key={club.id}
                        className="
                          border-b
                          border-gray-300
                          hover:bg-gray-50
                          transition-colors
                        "
                      >

                        {/* CLUB */}

                        <td className="
                          px-4
                          py-3
                        ">

                          <div className="
                            min-w-[240px]
                          ">

                            <p className="
                              text-sm
                              font-semibold
                              text-gray-900
                            ">
                              {club.name}
                            </p>

                            {club.description && (
                              <p
                                className="
                                  text-xs
                                  text-gray-500
                                  mt-1
                                  max-w-md
                                  truncate
                                "
                                title={club.description}
                              >
                                {club.description}
                              </p>
                            )}

                          </div>

                        </td>


                        {/* COORDINATOR */}

                        <td className="
                          px-4
                          py-3
                          text-sm
                          text-gray-700
                          whitespace-nowrap
                        ">
                          {club.facultyCoordinator || "—"}
                        </td>


                        {/* CONTACT */}

                        <td className="
                          px-4
                          py-3
                        ">

                          <div className="
                            space-y-1
                            text-sm
                          ">

                            {club.contactEmail && (
                              <div className="
                                flex
                                items-center
                                gap-2
                                text-gray-600
                                max-w-[260px]
                              ">

                                <Mail
                                  size={14}
                                  className="shrink-0"
                                />

                                <span className="truncate">
                                  {club.contactEmail}
                                </span>

                              </div>
                            )}

                            {club.contactPhone && (
                              <div className="
                                flex
                                items-center
                                gap-2
                                text-gray-600
                              ">

                                <Phone
                                  size={14}
                                  className="shrink-0"
                                />

                                <span>
                                  {club.contactPhone}
                                </span>

                              </div>
                            )}

                            {!club.contactEmail &&
                              !club.contactPhone && (
                                <span className="
                                  text-gray-400
                                ">
                                  —
                                </span>
                              )}

                          </div>

                        </td>


                        {/* STATUS */}

                        <td className="
                          px-4
                          py-3
                        ">

                          <span
                            className={`
                              inline-flex
                              px-2.5
                              py-1
                              rounded-full
                              text-xs
                              font-medium

                              ${
                                club.active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }
                            `}
                          >
                            {club.active
                              ? "Active"
                              : "Inactive"}
                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td className="
                          px-4
                          py-3
                        ">

                          <div className="
                            flex
                            items-center
                            justify-end
                            gap-2
                          ">

                            {/* VIEW */}

                            <button
                              type="button"
                              onClick={() =>
                                setViewClub(club)
                              }
                              className="
                                w-9
                                h-9
                                inline-flex
                                items-center
                                justify-center
                                border
                                border-gray-400
                                rounded-md
                                text-gray-600
                                bg-white
                                hover:bg-gray-100
                                hover:text-gray-900
                                transition
                              "
                              title="View Club"
                            >
                              <Eye size={17} />
                            </button>


                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                editClub(club)
                              }
                              className="
                                w-9
                                h-9
                                inline-flex
                                items-center
                                justify-center
                                border
                                border-gray-400
                                rounded-md
                                text-gray-600
                                bg-white
                                hover:bg-gray-100
                                hover:text-gray-900
                                transition
                              "
                              title="Edit Club"
                            >
                              <Pencil size={17} />
                            </button>


                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                deleteClub(club.id)
                              }
                              className="
                                w-9
                                h-9
                                inline-flex
                                items-center
                                justify-center
                                border
                                border-red-500
                                rounded-md
                                text-white
                                bg-red-600
                                hover:bg-red-700
                                transition
                              "
                              title="Delete Club"
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


              {/* PAGINATION STYLE */}

              <div className="
                px-4
                py-4
                border-t
                border-gray-300
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-4
              ">

                <div className="
                  text-sm
                  text-gray-600
                ">
                  1-{filteredClubs.length} of {filteredClubs.length}
                </div>


                <div className="
                  flex
                  items-center
                  gap-4
                ">

                  <div className="
                    flex
                    items-center
                    gap-2
                  ">

                    <span className="
                      text-sm
                      text-gray-600
                      whitespace-nowrap
                    ">
                      Rows per page
                    </span>

                    <select
                      value={10}
                      disabled
                      className="
                        h-9
                        px-2
                        border
                        border-gray-400
                        rounded-md
                        bg-white
                        text-sm
                        text-gray-700
                      "
                    >
                      <option value={10}>
                        10
                      </option>
                    </select>

                  </div>


                  <div className="
                    flex
                    items-center
                    gap-1
                  ">

                    <button
                      type="button"
                      disabled
                      className="
                        w-9
                        h-9
                        flex
                        items-center
                        justify-center
                        border
                        border-gray-400
                        rounded-md
                        bg-white
                        text-gray-400
                      "
                    >
                      <ChevronsLeft size={16} />
                    </button>

                    <button
                      type="button"
                      disabled
                      className="
                        w-9
                        h-9
                        flex
                        items-center
                        justify-center
                        border
                        border-gray-400
                        rounded-md
                        bg-white
                        text-gray-400
                      "
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <button
                      type="button"
                      className="
                        w-9
                        h-9
                        flex
                        items-center
                        justify-center
                        rounded-md
                        bg-teal-700
                        text-white
                        text-sm
                        font-semibold
                      "
                    >
                      1
                    </button>

                    <button
                      type="button"
                      disabled
                      className="
                        w-9
                        h-9
                        flex
                        items-center
                        justify-center
                        border
                        border-gray-400
                        rounded-md
                        bg-white
                        text-gray-400
                      "
                    >
                      <ChevronRight size={16} />
                    </button>

                    <button
                      type="button"
                      disabled
                      className="
                        w-9
                        h-9
                        flex
                        items-center
                        justify-center
                        border
                        border-gray-400
                        rounded-md
                        bg-white
                        text-gray-400
                      "
                    >
                      <ChevronsRight size={16} />
                    </button>

                  </div>

                </div>

              </div>

            </>

          )}

        </div>

      )}


      {/* =====================================================
          VIEW CLUB RIGHT DRAWER
      ===================================================== */}

      {viewClub && (

        <div className="
          fixed
          inset-0
          z-[100]
        ">

          {/* OVERLAY */}

          <div
            className="
              absolute
              inset-0
              bg-black/50
              backdrop-blur-[2px]
            "
            onClick={() => setViewClub(null)}
          />


          {/* DRAWER */}

          <div className="
            absolute
            top-0
            right-0
            h-full
            w-full
            sm:w-[520px]
            lg:w-[620px]
            bg-white
            shadow-2xl
            flex
            flex-col
          ">

            {/* DRAWER HEADER */}

            <div className="
              flex
              items-center
              justify-between
              px-6
              py-5
              border-b
              border-gray-300
              shrink-0
            ">

              <h2 className="
                text-xl
                font-semibold
                text-gray-900
                truncate
                pr-4
              ">
                {viewClub.name}
              </h2>


              <button
                type="button"
                onClick={() =>
                  setViewClub(null)
                }
                className="
                  w-10
                  h-10
                  rounded-full
                  border
                  border-gray-400
                  flex
                  items-center
                  justify-center
                  text-gray-600
                  hover:bg-gray-100
                  hover:text-gray-900
                  transition
                  shrink-0
                "
                title="Close"
              >
                <X size={20} />
              </button>

            </div>


            {/* DRAWER CONTENT */}

            <div className="
              flex-1
              overflow-y-auto
              px-6
              py-6
            ">

              <div className="space-y-5">

                {/* CLUB NAME */}

                <div className="
                  grid
                  grid-cols-1
                  sm:grid-cols-[190px_1fr]
                  gap-1
                  sm:gap-6
                ">

                  <p className="
                    text-sm
                    font-medium
                    text-gray-600
                  ">
                    Club Name
                  </p>

                  <p className="
                    text-sm
                    font-semibold
                    text-gray-900
                  ">
                    {viewClub.name || "—"}
                  </p>

                </div>


                {/* DESCRIPTION */}

                <div className="
                  grid
                  grid-cols-1
                  sm:grid-cols-[190px_1fr]
                  gap-1
                  sm:gap-6
                ">

                  <p className="
                    text-sm
                    font-medium
                    text-gray-600
                  ">
                    Description
                  </p>

                  <p className="
                    text-sm
                    text-gray-800
                    leading-6
                    whitespace-pre-wrap
                  ">
                    {viewClub.description || "—"}
                  </p>

                </div>


                {/* FACULTY COORDINATOR */}

                <div className="
                  grid
                  grid-cols-1
                  sm:grid-cols-[190px_1fr]
                  gap-1
                  sm:gap-6
                ">

                  <p className="
                    text-sm
                    font-medium
                    text-gray-600
                  ">
                    Faculty Coordinator
                  </p>

                  <p className="
                    text-sm
                    text-gray-900
                  ">
                    {viewClub.facultyCoordinator || "—"}
                  </p>

                </div>


                {/* EMAIL */}

                <div className="
                  grid
                  grid-cols-1
                  sm:grid-cols-[190px_1fr]
                  gap-1
                  sm:gap-6
                ">

                  <p className="
                    text-sm
                    font-medium
                    text-gray-600
                  ">
                    Contact Email
                  </p>

                  <p className="
                    text-sm
                    text-gray-900
                    break-all
                  ">
                    {viewClub.contactEmail || "—"}
                  </p>

                </div>


                {/* PHONE */}

                <div className="
                  grid
                  grid-cols-1
                  sm:grid-cols-[190px_1fr]
                  gap-1
                  sm:gap-6
                ">

                  <p className="
                    text-sm
                    font-medium
                    text-gray-600
                  ">
                    Contact Phone
                  </p>

                  <p className="
                    text-sm
                    text-gray-900
                  ">
                    {viewClub.contactPhone || "—"}
                  </p>

                </div>


                {/* STATUS */}

                <div className="
                  grid
                  grid-cols-1
                  sm:grid-cols-[190px_1fr]
                  gap-1
                  sm:gap-6
                ">

                  <p className="
                    text-sm
                    font-medium
                    text-gray-600
                  ">
                    Status
                  </p>

                  <div>

                    <span
                      className={`
                        inline-flex
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-medium

                        ${
                          viewClub.active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }
                      `}
                    >
                      {viewClub.active
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                </div>

              </div>

            </div>


            {/* DRAWER FOOTER */}

            <div className="
              px-6
              py-4
              border-t
              border-gray-300
              bg-white
              shrink-0
              flex
              justify-end
            ">

              <button
                type="button"
                onClick={() =>
                  setViewClub(null)
                }
                className="
                  px-5
                  py-2.5
                  border
                  border-gray-400
                  rounded-md
                  bg-white
                  text-sm
                  font-medium
                  text-gray-700
                  hover:bg-gray-100
                  transition
                "
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminClubs;