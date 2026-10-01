import { useEffect, useMemo, useState } from "react";

import {
  Plus,
  Pencil,
  Trash2,
  X,
  Megaphone,
  Search,
  CheckCircle2,
  Clock3,
  Loader2,
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
  title: "",
  message: "",
  published: false,
};

const MAX_MESSAGE_LENGTH = 1000;

/* =========================================================
   COMPONENT
========================================================= */

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingAnnouncement, setEditingAnnouncement] =
    useState(null);

  const [form, setForm] = useState(emptyForm);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  // View drawer
  const [viewAnnouncement, setViewAnnouncement] =
    useState(null);

  /* =========================================================
     FETCH ANNOUNCEMENTS
  ========================================================= */

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);

      const data = await apiFetch(
        "/admin/announcements"
      );

      const announcementList = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : [];

      setAnnouncements(announcementList);
    } catch (error) {
      console.error(
        "Failed to fetch announcements:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Unable to load announcements",
        text:
          error.message ||
          "Something went wrong.",
        confirmButtonColor: "#0f766e",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredAnnouncements = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    if (!keyword) {
      return announcements;
    }

    return announcements.filter(
      (announcement) => {
        const title =
          announcement.title || "";

        const message =
          announcement.message || "";

        return (
          title
            .toLowerCase()
            .includes(keyword) ||
          message
            .toLowerCase()
            .includes(keyword)
        );
      }
    );
  }, [announcements, search]);

  /* =========================================================
     OPEN CREATE FORM
  ========================================================= */

  const openCreateForm = () => {
    setEditingAnnouncement(null);

    setForm(emptyForm);

    setShowForm(true);
  };

  /* =========================================================
     OPEN EDIT FORM
  ========================================================= */

  const openEditForm = (announcement) => {
    setEditingAnnouncement(announcement);

    setForm({
      title: announcement.title || "",
      message: announcement.message || "",
      published:
        Boolean(announcement.published),
    });

    setShowForm(true);
  };

  /* =========================================================
     CLOSE FORM
  ========================================================= */

  const closeForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);

    setEditingAnnouncement(null);

    setForm(emptyForm);
  };

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validateForm = () => {
    const title =
      form.title.trim();

    const message =
      form.message.trim();

    if (!title) {
      Swal.fire({
        icon: "warning",
        title: "Title required",
        text:
          "Please enter an announcement title.",
        confirmButtonColor: "#0f766e",
      });

      return false;
    }

    if (title.length > 150) {
      Swal.fire({
        icon: "warning",
        title: "Title too long",
        text:
          "Announcement title cannot exceed 150 characters.",
        confirmButtonColor: "#0f766e",
      });

      return false;
    }

    if (!message) {
      Swal.fire({
        icon: "warning",
        title: "Message required",
        text:
          "Please enter the announcement message.",
        confirmButtonColor: "#0f766e",
      });

      return false;
    }

    if (
      message.length >
      MAX_MESSAGE_LENGTH
    ) {
      Swal.fire({
        icon: "warning",
        title: "Message too long",
        text:
          `Announcement message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`,
        confirmButtonColor: "#0f766e",
      });

      return false;
    }

    return true;
  };

  /* =========================================================
     SAVE ANNOUNCEMENT
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      title: form.title.trim(),

      message: form.message.trim(),

      published: form.published,
    };

    try {
      setSaving(true);

      if (editingAnnouncement) {
        await apiFetch(
          `/admin/announcements/${editingAnnouncement.id}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );

        await Swal.fire({
          icon: "success",
          title: "Announcement updated",
          text:
            "The announcement has been updated successfully.",
          confirmButtonColor: "#0f766e",
          timer: 1600,
          showConfirmButton: false,
        });
      } else {
        await apiFetch(
          "/admin/announcements",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );

        await Swal.fire({
          icon: "success",
          title: "Announcement created",
          text:
            "The announcement has been created successfully.",
          confirmButtonColor: "#0f766e",
          timer: 1600,
          showConfirmButton: false,
        });
      }

      closeForm();

      await fetchAnnouncements();

    } catch (error) {
      console.error(
        "Failed to save announcement:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Save failed",
        text:
          error.message ||
          "Unable to save the announcement.",
        confirmButtonColor: "#0f766e",
      });
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     DELETE ANNOUNCEMENT
  ========================================================= */

  const handleDelete = async (announcement) => {
    const result = await Swal.fire({
      icon: "warning",

      title: "Delete announcement?",

      text:
        `"${announcement.title}" will be permanently deleted.`,

      showCancelButton: true,

      confirmButtonText: "Yes, delete",

      cancelButtonText: "Cancel",

      confirmButtonColor: "#dc2626",

      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setDeletingId(
        announcement.id
      );

      await apiFetch(
        `/admin/announcements/${announcement.id}`,
        {
          method: "DELETE",
        }
      );

      setAnnouncements(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !== announcement.id
          )
      );

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text:
          "The announcement has been deleted successfully.",
        confirmButtonColor: "#0f766e",
        timer: 1400,
        showConfirmButton: false,
      });

    } catch (error) {
      console.error(
        "Failed to delete announcement:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text:
          error.message ||
          "Unable to delete the announcement.",
        confirmButtonColor: "#0f766e",
      });
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

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

        <h1 className="
          text-2xl
          font-semibold
          text-gray-900
        ">
          Announcements
        </h1>

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
          New
        </button>

      </div>


      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="
        mb-4
      ">

        <div className="
          relative
          w-full
          sm:w-[430px]
        ">

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
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search announcements"
            className="
              w-full
              h-11
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


      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="
        bg-white
        border
        border-gray-400
        rounded-lg
        overflow-hidden
      ">

        {loading ? (

          <div className="
            min-h-[280px]
            flex
            items-center
            justify-center
          ">

            <div className="
              flex
              items-center
              gap-3
              text-sm
              text-gray-500
            ">

              <Loader2
                size={20}
                className="
                  animate-spin
                  text-teal-700
                "
              />

              Loading announcements...

            </div>

          </div>

        ) : filteredAnnouncements.length === 0 ? (

          <div className="
            min-h-[280px]
            flex
            flex-col
            items-center
            justify-center
            px-6
            text-center
          ">

            <div className="
              w-14
              h-14
              rounded-full
              bg-gray-100
              flex
              items-center
              justify-center
              text-gray-400
              mb-4
            ">

              <Megaphone size={25} />

            </div>

            <h3 className="
              text-base
              font-semibold
              text-gray-900
            ">
              No announcements found
            </h3>

            <p className="
              mt-1
              text-sm
              text-gray-500
            ">
              {search
                ? "Try changing your search."
                : "Create your first announcement to get started."}
            </p>

          </div>

        ) : (

          <>
            {/* =================================================
                TABLE
            ================================================= */}

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
                      px-5
                      py-3.5
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
                        Title

                        <span className="
                          text-gray-400
                        ">
                          ↕
                        </span>
                      </div>
                    </th>


                    <th className="
                      px-5
                      py-3.5
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
                        Message

                        <span className="
                          text-gray-400
                        ">
                          ↕
                        </span>
                      </div>
                    </th>


                    <th className="
                      px-5
                      py-3.5
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

                        <span className="
                          text-gray-400
                        ">
                          ↕
                        </span>
                      </div>
                    </th>


                    <th className="
                      px-5
                      py-3.5
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
                        Created

                        <span className="
                          text-gray-400
                        ">
                          ↕
                        </span>
                      </div>
                    </th>


                    <th className="
                      px-5
                      py-3.5
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

                  {filteredAnnouncements.map(
                    (announcement) => (

                      <tr
                        key={announcement.id}
                        className="
                          border-b
                          border-gray-300
                          last:border-b-0
                          hover:bg-gray-50
                          transition
                        "
                      >

                        {/* TITLE */}

                        <td className="
                          px-5
                          py-4
                        ">

                          <div className="
                            min-w-[220px]
                          ">

                            <p className="
                              text-sm
                              font-semibold
                              text-gray-900
                            ">
                              {announcement.title ||
                                "-"}
                            </p>

                          </div>

                        </td>


                        {/* MESSAGE */}

                        <td className="
                          px-5
                          py-4
                        ">

                          <p
                            className="
                              max-w-[480px]
                              truncate
                              text-sm
                              text-gray-700
                            "
                            title={
                              announcement.message ||
                              ""
                            }
                          >
                            {announcement.message ||
                              "-"}
                          </p>

                        </td>


                        {/* STATUS */}

                        <td className="
                          px-5
                          py-4
                        ">

                          {announcement.published ? (

                            <span className="
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              bg-green-100
                              px-3
                              py-1
                              text-xs
                              font-medium
                              text-green-700
                            ">

                              <CheckCircle2
                                size={13}
                              />

                              Published

                            </span>

                          ) : (

                            <span className="
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              bg-gray-100
                              px-3
                              py-1
                              text-xs
                              font-medium
                              text-gray-600
                            ">

                              <Clock3
                                size={13}
                              />

                              Draft

                            </span>

                          )}

                        </td>


                        {/* CREATED */}

                        <td className="
                          px-5
                          py-4
                          text-sm
                          text-gray-700
                          whitespace-nowrap
                        ">
                          {formatDate(
                            announcement.createdAt
                          )}
                        </td>


                        {/* ACTIONS */}

                        <td className="
                          px-5
                          py-4
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
                                setViewAnnouncement(
                                  announcement
                                )
                              }
                              disabled={
                                deletingId ===
                                announcement.id
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
                                bg-white
                                text-gray-600
                                hover:bg-gray-100
                                hover:text-gray-900
                                transition
                                disabled:opacity-50
                              "
                              title="View announcement"
                            >
                              <Eye size={17} />
                            </button>


                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                openEditForm(
                                  announcement
                                )
                              }
                              disabled={
                                deletingId ===
                                announcement.id
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
                                bg-white
                                text-gray-600
                                hover:bg-gray-100
                                hover:text-gray-900
                                transition
                                disabled:opacity-50
                              "
                              title="Edit announcement"
                            >
                              <Pencil size={17} />
                            </button>


                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  announcement
                                )
                              }
                              disabled={
                                deletingId ===
                                announcement.id
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
                                bg-red-600
                                text-white
                                hover:bg-red-700
                                transition
                                disabled:opacity-50
                              "
                              title="Delete announcement"
                            >

                              {deletingId ===
                              announcement.id ? (

                                <Loader2
                                  size={16}
                                  className="
                                    animate-spin
                                  "
                                />

                              ) : (

                                <Trash2
                                  size={17}
                                />

                              )}

                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>


            {/* =================================================
                PAGINATION FOOTER
            ================================================= */}

            <div className="
              px-5
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
                1-{filteredAnnouncements.length} of{" "}
                {filteredAnnouncements.length}
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
                    <ChevronsLeft
                      size={16}
                    />
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
                    <ChevronLeft
                      size={16}
                    />
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
                    <ChevronRight
                      size={16}
                    />
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
                    <ChevronsRight
                      size={16}
                    />
                  </button>

                </div>

              </div>

            </div>

          </>

        )}

      </div>


      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      {showForm && (

        <div className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          bg-black/50
          p-4
        ">

          <div className="
            max-h-[90vh]
            w-full
            max-w-2xl
            overflow-y-auto
            rounded-xl
            bg-white
            shadow-2xl
          ">

            {/* MODAL HEADER */}

            <div className="
              sticky
              top-0
              z-10
              flex
              items-center
              justify-between
              border-b
              border-gray-300
              bg-white
              px-6
              py-5
            ">

              <div>

                <h2 className="
                  text-lg
                  font-semibold
                  text-gray-900
                ">
                  {editingAnnouncement
                    ? "Edit Announcement"
                    : "Create Announcement"}
                </h2>

                <p className="
                  mt-1
                  text-sm
                  text-gray-500
                ">
                  {editingAnnouncement
                    ? "Update the announcement details."
                    : "Enter the announcement details below."}
                </p>

              </div>


              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="
                  w-9
                  h-9
                  flex
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-gray-400
                  text-gray-500
                  hover:bg-gray-100
                  hover:text-gray-800
                  transition
                  disabled:opacity-50
                "
              >
                <X size={19} />
              </button>

            </div>


            {/* FORM */}

            <form onSubmit={handleSubmit}>

              <div className="
                space-y-6
                px-6
                py-6
              ">

                {/* TITLE */}

                <div>

                  <label
                    htmlFor="announcement-title"
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-gray-700
                    "
                  >
                    Title
                    <span className="
                      text-red-500
                      ml-1
                    ">
                      *
                    </span>
                  </label>

                  <input
                    id="announcement-title"
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    maxLength={150}
                    placeholder="Enter announcement title"
                    disabled={saving}
                    className="
                      w-full
                      rounded-md
                      border
                      border-gray-400
                      bg-white
                      px-3.5
                      py-2.5
                      text-sm
                      text-gray-900
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-teal-600
                      focus:ring-1
                      focus:ring-teal-600
                      disabled:bg-gray-100
                    "
                  />

                  <div className="
                    mt-1.5
                    flex
                    justify-end
                  ">
                    <span className="
                      text-xs
                      text-gray-400
                    ">
                      {form.title.length}/150
                    </span>
                  </div>

                </div>


                {/* MESSAGE */}

                <div>

                  <label
                    htmlFor="announcement-message"
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-gray-700
                    "
                  >
                    Message
                    <span className="
                      text-red-500
                      ml-1
                    ">
                      *
                    </span>
                  </label>

                  <textarea
                    id="announcement-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    maxLength={
                      MAX_MESSAGE_LENGTH
                    }
                    rows={7}
                    placeholder="Enter the announcement message..."
                    disabled={saving}
                    className="
                      w-full
                      resize-y
                      rounded-md
                      border
                      border-gray-400
                      bg-white
                      px-3.5
                      py-3
                      text-sm
                      text-gray-900
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-teal-600
                      focus:ring-1
                      focus:ring-teal-600
                      disabled:bg-gray-100
                    "
                  />

                  <div className="
                    mt-1.5
                    flex
                    items-center
                    justify-between
                  ">

                    <p className="
                      text-xs
                      text-gray-400
                    ">
                      Keep the message clear and easy to understand.
                    </p>

                    <span className={`
                      text-xs
                      ${
                        form.message.length >=
                        MAX_MESSAGE_LENGTH
                          ? "font-medium text-red-600"
                          : "text-gray-400"
                      }
                    `}>
                      {form.message.length}/
                      {MAX_MESSAGE_LENGTH}
                    </span>

                  </div>

                </div>


                {/* PUBLISHING */}

                <div className="
                  border-t
                  border-gray-300
                  pt-6
                ">

                  <h3 className="
                    mb-4
                    text-sm
                    font-semibold
                    text-gray-900
                  ">
                    Publishing
                  </h3>

                  <div className="
                    rounded-md
                    border
                    border-gray-300
                    bg-gray-50
                    p-4
                  ">

                    <label className="
                      flex
                      cursor-pointer
                      items-start
                      gap-3
                    ">

                      <input
                        type="checkbox"
                        name="published"
                        checked={
                          form.published
                        }
                        onChange={
                          handleChange
                        }
                        disabled={saving}
                        className="
                          mt-0.5
                          h-4
                          w-4
                          rounded
                          border-gray-400
                          text-teal-700
                          focus:ring-teal-600
                        "
                      />

                      <span>

                        <span className="
                          block
                          text-sm
                          font-medium
                          text-gray-800
                        ">
                          Publish announcement
                        </span>

                        <span className="
                          mt-1
                          block
                          text-xs
                          text-gray-500
                        ">
                          Published announcements can be displayed to students. Leave unchecked to save it as a draft.
                        </span>

                      </span>

                    </label>

                  </div>

                </div>

              </div>


              {/* MODAL FOOTER */}

              <div className="
                sticky
                bottom-0
                flex
                flex-col-reverse
                gap-3
                border-t
                border-gray-300
                bg-white
                px-6
                py-4
                sm:flex-row
                sm:justify-end
              ">

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-md
                    border
                    border-gray-400
                    bg-white
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-gray-700
                    transition
                    hover:bg-gray-100
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={saving}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-md
                    bg-teal-700
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-teal-800
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {saving ? (

                    <>
                      <Loader2
                        size={17}
                        className="
                          animate-spin
                        "
                      />

                      Saving...
                    </>

                  ) : (

                    <>
                      {editingAnnouncement ? (
                        <Pencil size={17} />
                      ) : (
                        <Plus size={17} />
                      )}

                      {editingAnnouncement
                        ? "Update Announcement"
                        : "Create Announcement"}
                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =====================================================
          VIEW ANNOUNCEMENT RIGHT DRAWER
      ===================================================== */}

      {viewAnnouncement && (

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
            onClick={() =>
              setViewAnnouncement(null)
            }
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
                {viewAnnouncement.title}
              </h2>


              <button
                type="button"
                onClick={() =>
                  setViewAnnouncement(null)
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

              <div className="
                space-y-6
              ">

                {/* TITLE */}

                <div className="
                  grid
                  grid-cols-1
                  sm:grid-cols-[150px_1fr]
                  gap-1
                  sm:gap-6
                ">

                  <p className="
                    text-sm
                    font-medium
                    text-gray-600
                  ">
                    Title
                  </p>

                  <p className="
                    text-sm
                    font-semibold
                    text-gray-900
                  ">
                    {viewAnnouncement.title ||
                      "—"}
                  </p>

                </div>


                {/* MESSAGE */}

                <div className="
                  grid
                  grid-cols-1
                  sm:grid-cols-[150px_1fr]
                  gap-1
                  sm:gap-6
                ">

                  <p className="
                    text-sm
                    font-medium
                    text-gray-600
                  ">
                    Message
                  </p>

                  <p className="
                    text-sm
                    text-gray-900
                    leading-6
                    whitespace-pre-wrap
                  ">
                    {viewAnnouncement.message ||
                      "—"}
                  </p>

                </div>


                {/* STATUS */}

                <div className="
                  grid
                  grid-cols-1
                  sm:grid-cols-[150px_1fr]
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

                    {viewAnnouncement.published ? (

                      <span className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-green-100
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-green-700
                      ">

                        <CheckCircle2
                          size={13}
                        />

                        Published

                      </span>

                    ) : (

                      <span className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-gray-100
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-gray-600
                      ">

                        <Clock3
                          size={13}
                        />

                        Draft

                      </span>

                    )}

                  </div>

                </div>


                {/* CREATED */}

                <div className="
                  grid
                  grid-cols-1
                  sm:grid-cols-[150px_1fr]
                  gap-1
                  sm:gap-6
                ">

                  <p className="
                    text-sm
                    font-medium
                    text-gray-600
                  ">
                    Created
                  </p>

                  <p className="
                    text-sm
                    text-gray-900
                  ">
                    {formatDate(
                      viewAnnouncement.createdAt
                    )}
                  </p>

                </div>


                {/* ID */}

                <div className="
                  grid
                  grid-cols-1
                  sm:grid-cols-[150px_1fr]
                  gap-1
                  sm:gap-6
                ">

                  <p className="
                    text-sm
                    font-medium
                    text-gray-600
                  ">
                    Announcement ID
                  </p>

                  <p className="
                    text-sm
                    text-gray-900
                  ">
                    {viewAnnouncement.id ||
                      "—"}
                  </p>

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
                  setViewAnnouncement(null)
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
};

export default AdminAnnouncements;