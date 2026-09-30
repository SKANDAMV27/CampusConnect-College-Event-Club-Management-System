import { useEffect, useState } from "react";

import {
  Plus,
  Pencil,
  Trash2,
  X,
  Users,
  FileText,
  Mail,
  Phone,
  UserRound,
  Search,
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

      description:
        club.description || "",

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
        mb-8
      ">


        <div>

          <h1 className="
            text-3xl
            font-bold
            text-gray-900
          ">
            Clubs
          </h1>


          <p className="
            text-gray-500
            mt-1
          ">
            Create and manage college clubs.
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

            Add Club

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
          border-gray-200
          rounded-xl
          shadow-sm
          mb-8
        ">


          {/* -------------------------------------------------
              FORM HEADER
          ------------------------------------------------- */}

          <div className="
            px-6
            py-5
            border-b
            border-gray-200
            flex
            items-center
            justify-between
          ">


            <div>

              <h2 className="
                text-xl
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
                p-2
                rounded-lg
                text-gray-500
                hover:bg-gray-100
                hover:text-gray-700
                transition
                disabled:opacity-50
              "
            >

              <X size={21} />

            </button>

          </div>


          {/* -------------------------------------------------
              FORM
          ------------------------------------------------- */}

          <form onSubmit={handleSubmit}>


            <div className="
              p-6
              space-y-8
            ">


              {/* =================================================
                  CLUB INFORMATION
              ================================================= */}

              <section>


                <div className="
                  flex
                  items-center
                  gap-2
                  mb-5
                ">

                  <Users
                    size={19}
                    className="text-blue-600"
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


                  {/* Club Name */}

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


                  {/* Faculty Coordinator */}

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


                  {/* Description */}

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


              {/* =================================================
                  CONTACT INFORMATION
              ================================================= */}

              <section>


                <div className="
                  flex
                  items-center
                  gap-2
                  mb-5
                ">

                  <Mail
                    size={19}
                    className="text-blue-600"
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


                  {/* Contact Email */}

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


                  {/* Contact Phone */}

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
                  CLUB STATUS
              ================================================= */}

              <section>


                <div className="
                  flex
                  items-center
                  gap-2
                  mb-5
                ">

                  <Users
                    size={19}
                    className="text-blue-600"
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

                onClick={resetForm}

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
          border-gray-200
          rounded-xl
          shadow-sm
          overflow-hidden
        ">


          {/* -------------------------------------------------
              TABLE HEADER
          ------------------------------------------------- */}

          <div className="
            px-6
            py-5
            border-b
            border-gray-200
          ">

            <div className="
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-4
            ">


              <div>

                <h2 className="
                  text-lg
                  font-semibold
                  text-gray-900
                ">
                  All Clubs
                </h2>


                <p className="
                  text-sm
                  text-gray-500
                  mt-1
                ">

                  {clubs.length} club
                  {clubs.length !== 1 ? "s" : ""}

                </p>

              </div>


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

                  onChange={(e) =>
                    setSearch(e.target.value)
                  }

                  placeholder="Search clubs..."

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

            </div>

          </div>


          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (

            <div className="
              p-10
              text-center
              text-gray-500
            ">

              Loading clubs...

            </div>

          ) : filteredClubs.length === 0 ? (


            /* =================================================
               EMPTY STATE
            ================================================= */

            <div className="
              p-12
              text-center
            ">

              <Users
                size={45}
                className="
                  mx-auto
                  text-gray-300
                  mb-3
                "
              />


              <h3 className="
                font-medium
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


            /* =================================================
               TABLE
            ================================================= */

            <div className="overflow-x-auto">

              <table className="w-full">


                <thead className="
                  bg-gray-50
                  border-b
                ">

                  <tr>


                    <th className="
                      text-left
                      px-6
                      py-4
                      text-sm
                      font-semibold
                      text-gray-600
                    ">
                      Club
                    </th>


                    <th className="
                      text-left
                      px-6
                      py-4
                      text-sm
                      font-semibold
                      text-gray-600
                    ">
                      Coordinator
                    </th>


                    <th className="
                      text-left
                      px-6
                      py-4
                      text-sm
                      font-semibold
                      text-gray-600
                    ">
                      Contact
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

                  {filteredClubs.map((club) => (

                    <tr

                      key={club.id}

                      className="
                        border-b
                        last:border-b-0
                        hover:bg-gray-50
                      "
                    >


                      {/* =================================================
                          CLUB
                      ================================================= */}

                      <td className="px-6 py-4">

                        <p className="
                          font-medium
                          text-gray-900
                        ">

                          {club.name}

                        </p>


                        {club.description && (

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
                              cursor-help"
                            >

                              {club.description}

                            </p>


                            {/* Full Description Hover */}

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

                                {club.description}

                              </div>

                            </div>

                          </div>

                        )}

                      </td>


                      {/* =================================================
                          COORDINATOR
                      ================================================= */}

                      <td className="
                        px-6
                        py-4
                        text-sm
                        text-gray-600
                      ">

                        {club.facultyCoordinator || "—"}

                      </td>


                      {/* =================================================
                          CONTACT
                      ================================================= */}

                      <td className="px-6 py-4">

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
                            ">

                              <Mail size={14} />

                              <span>
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

                              <Phone size={14} />

                              <span>
                                {club.contactPhone}
                              </span>

                            </div>

                          )}


                          {!club.contactEmail &&
                            !club.contactPhone && (

                              <span className="text-gray-400">
                                —
                              </span>

                            )}

                        </div>

                      </td>


                      {/* =================================================
                          STATUS
                      ================================================= */}

                      <td className="px-6 py-4">

                        <span className={`
                          inline-flex
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-medium

                          ${
                            club.active

                              ? "bg-green-100 text-green-700"

                              : "bg-gray-100 text-gray-600"
                          }
                        `}>

                          {club.active
                            ? "Active"
                            : "Inactive"}

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
                              editClub(club)
                            }

                            className="
                              p-2
                              rounded-lg
                              bg-yellow-50
                              text-yellow-700
                              hover:bg-yellow-100
                              transition
                            "

                            title="Edit Club"
                          >

                            <Pencil size={17} />

                          </button>


                          {/* Delete */}

                          <button

                            type="button"

                            onClick={() =>
                              deleteClub(club.id)
                            }

                            className="
                              p-2
                              rounded-lg
                              bg-red-50
                              text-red-700
                              hover:bg-red-100
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

          )}

        </div>

      )}

    </div>

  );
}
export default AdminClubs;