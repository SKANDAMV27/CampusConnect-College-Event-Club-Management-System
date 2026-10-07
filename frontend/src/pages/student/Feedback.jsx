import { useState } from "react";

import {
  Send,
  MessageSquareText,
  ArrowLeft,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Swal from "sweetalert2";

import {
  submitEventFeedback,
} from "../../api/studentApi";


const QUESTIONS = [
  "How would you rate the overall quality of the event?",
  "How satisfied were you with the event organization?",
  "How would you rate the content/session quality?",
  "How knowledgeable was the speaker/resource person?",
  "How clearly was the information presented?",
  "How relevant was the event to your academic or career interests?",
  "How would you rate the venue and facilities?",
  "How would you rate the time management of the event?",
  "How engaging and interactive was the event?",
  "How likely are you to recommend similar events in the future?",
];


function Feedback() {

  const {
    eventId,
  } = useParams();

  const navigate =
    useNavigate();


  const [ratings, setRatings] =
    useState(
      Array(10).fill(0)
    );


  const [description, setDescription] =
    useState("");


  const [submitting, setSubmitting] =
    useState(false);


  // =========================================================
  // RATING
  // =========================================================

  const handleRating = (
    questionIndex,
    rating
  ) => {

    setRatings((previous) => {

      const updated =
        [...previous];

      updated[questionIndex] =
        rating;

      return updated;
    });
  };


  // =========================================================
  // SUBMIT FEEDBACK
  // =========================================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();


    if (submitting) {
      return;
    }


    // -------------------------------------------------------
    // EVENT ID VALIDATION
    // -------------------------------------------------------

    if (!eventId) {

      await Swal.fire({
        icon: "error",
        title: "Invalid Event",
        text:
          "Unable to identify the event.",
        confirmButtonColor:
          "#4f46e5",
      });

      return;
    }


    // -------------------------------------------------------
    // CHECK ALL RATINGS
    // -------------------------------------------------------

    const incompleteQuestion =
      ratings.findIndex(
        (rating) => rating < 1
      );


    if (
      incompleteQuestion !== -1
    ) {

      await Swal.fire({
        icon: "warning",
        title: "Complete all ratings",
        text:
          `Please provide a rating for question ${
            incompleteQuestion + 1
          }.`,
        confirmButtonColor:
          "#4f46e5",
      });

      return;
    }


    try {

      setSubmitting(true);


      // -----------------------------------------------------
      // SUBMIT API
      // -----------------------------------------------------

      await submitEventFeedback(
        eventId,
        {
          question1Rating:
            ratings[0],

          question2Rating:
            ratings[1],

          question3Rating:
            ratings[2],

          question4Rating:
            ratings[3],

          question5Rating:
            ratings[4],

          question6Rating:
            ratings[5],

          question7Rating:
            ratings[6],

          question8Rating:
            ratings[7],

          question9Rating:
            ratings[8],

          question10Rating:
            ratings[9],

          description:
            description.trim(),
        }
      );


      // -----------------------------------------------------
      // SUCCESS
      // -----------------------------------------------------

      await Swal.fire({
        icon: "success",
        title: "Feedback Submitted",
        text:
          "Thank you for sharing your feedback.",
        confirmButtonColor:
          "#4f46e5",
      });


      // -----------------------------------------------------
      // GO BACK TO CORRECT FRONTEND ROUTE
      // -----------------------------------------------------

      navigate(
        "/my-registrations",
        {
          replace: true,
        }
      );

    } catch (error) {

      console.error(
        "Failed to submit feedback:",
        error
      );


      let errorMessage =
        "Something went wrong while submitting your feedback.";


      if (
        typeof error?.response?.data ===
        "string"
      ) {

        errorMessage =
          error.response.data;

      } else if (
        error?.response?.data?.message
      ) {

        errorMessage =
          error.response.data.message;

      } else if (
        error?.message
      ) {

        errorMessage =
          error.message;
      }


      await Swal.fire({
        icon: "error",
        title: "Unable to submit feedback",
        text: errorMessage,
        confirmButtonColor:
          "#4f46e5",
      });

    } finally {

      setSubmitting(false);

    }
  };


  // =========================================================
  // BACK TO REGISTRATIONS
  // =========================================================

  const handleBack = () => {

    if (submitting) {
      return;
    }

    navigate(
      "/my-registrations"
    );
  };


  // =========================================================
  // UI
  // =========================================================

  return (

    <div
      className="
        mx-auto
        w-full
        max-w-4xl
        pb-10
      "
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6">

        <button
          type="button"
          onClick={handleBack}
          disabled={submitting}
          className="
            mb-5
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-slate-500
            transition
            hover:text-indigo-600
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >

          <ArrowLeft
            size={17}
          />

          Back to My Registrations

        </button>


        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
            sm:p-8
          "
        >

          <div
            className="
              flex
              items-start
              gap-4
            "
          >

            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-indigo-50
              "
            >

              <MessageSquareText
                className="
                  h-6
                  w-6
                  text-indigo-600
                "
              />

            </div>


            <div>

              <h1
                className="
                  text-2xl
                  font-bold
                  text-slate-900
                  sm:text-3xl
                "
              >
                Event Feedback
              </h1>


              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                Your feedback helps us
                improve future campus
                events.
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          FORM
      ===================================================== */}

      <form
        onSubmit={handleSubmit}
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >

        {/* ===================================================
            QUESTIONS
        =================================================== */}

        <div
          className="
            divide-y
            divide-slate-200
          "
        >

          {QUESTIONS.map(
            (
              question,
              index
            ) => {

              const selectedRating =
                ratings[index];


              return (

                <div
                  key={index}
                  className="
                    p-6
                    sm:p-8
                  "
                >

                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >

                    {/* QUESTION NUMBER */}

                    <span
                      className="
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-indigo-50
                        text-xs
                        font-bold
                        text-indigo-600
                      "
                    >
                      {index + 1}
                    </span>


                    <div
                      className="
                        flex-1
                      "
                    >

                      {/* QUESTION */}

                      <h2
                        className="
                          text-sm
                          font-semibold
                          leading-6
                          text-slate-800
                          sm:text-base
                        "
                      >
                        {question}
                      </h2>


                      {/* RATINGS */}

                      <div
                        className="
                          mt-5
                          overflow-x-auto
                        "
                      >

                        <div
                          className="
                            flex
                            min-w-max
                            gap-2
                          "
                        >

                          {Array.from(
                            {
                              length: 10,
                            },
                            (
                              _,
                              ratingIndex
                            ) => {

                              const rating =
                                ratingIndex + 1;

                              const selected =
                                selectedRating ===
                                rating;


                              return (

                                <button
                                  key={rating}
                                  type="button"
                                  onClick={() =>
                                    handleRating(
                                      index,
                                      rating
                                    )
                                  }
                                  className={`
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    text-sm
                                    font-semibold
                                    transition
                                    ${
                                      selected
                                        ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                                        : "border-slate-300 bg-white text-slate-600 hover:border-indigo-400 hover:bg-indigo-50"
                                    }
                                  `}
                                  aria-label={
                                    `Rating ${rating}`
                                  }
                                >

                                  {rating}

                                </button>

                              );
                            }
                          )}

                        </div>

                      </div>


                      {/* RATING LABELS */}

                      <div
                        className="
                          mt-2
                          flex
                          justify-between
                          text-xs
                          text-slate-400
                        "
                      >

                        <span>
                          1 - Very Poor
                        </span>

                        <span>
                          10 - Excellent
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              );
            }
          )}

        </div>


        {/* ===================================================
            DESCRIPTION
        =================================================== */}

        <div
          className="
            border-t
            border-slate-200
            p-6
            sm:p-8
          "
        >

          <label
            className="
              mb-2
              block
              text-sm
              font-semibold
              text-slate-800
            "
          >
            Additional Comments or Suggestions
          </label>


          <p
            className="
              mb-3
              text-sm
              text-slate-500
            "
          >
            Tell us what you liked or what
            could be improved.
          </p>


          <textarea
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            rows={5}
            maxLength={1000}
            placeholder="Enter your feedback here..."
            className="
              w-full
              resize-none
              rounded-xl
              border
              border-slate-300
              px-4
              py-3
              text-sm
              text-slate-800
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-indigo-500
              focus:ring-4
              focus:ring-indigo-100
            "
          />


          <div
            className="
              mt-2
              text-right
              text-xs
              text-slate-400
            "
          >
            {description.length}/1000
          </div>

        </div>


        {/* ===================================================
            ACTIONS
        =================================================== */}

        <div
          className="
            flex
            flex-col-reverse
            gap-3
            border-t
            border-slate-200
            bg-slate-50
            p-6
            sm:flex-row
            sm:justify-end
          "
        >

          {/* CANCEL */}

          <button
            type="button"
            onClick={handleBack}
            disabled={submitting}
            className="
              rounded-xl
              border
              border-slate-300
              bg-white
              px-6
              py-3
              text-sm
              font-semibold
              text-slate-700
              transition
              hover:bg-slate-100
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancel
          </button>


          {/* SUBMIT */}

          <button
            type="submit"
            disabled={submitting}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-indigo-600
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-indigo-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >

            {submitting ? (

              <>

                <span
                  className="
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-white/40
                    border-t-white
                  "
                />

                Submitting...

              </>

            ) : (

              <>

                <Send
                  size={17}
                />

                Submit Feedback

              </>

            )}

          </button>

        </div>

      </form>

    </div>
  );
}


export default Feedback;