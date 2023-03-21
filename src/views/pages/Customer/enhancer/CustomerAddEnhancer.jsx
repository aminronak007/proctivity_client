import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    first_name: Yup.string()
      .required("Please enter first name")
      .max(50)
      .matches(/^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$/, "Please enter valid first name"),
    last_name: Yup.string()
      .required("Please enter last name")
      .max(50)
      .matches(/^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$/, "Please enter valid last name"),
    email: Yup.string()
      .email("The email you have entered is invalid")
      .max(60)
      .required("Please enter email"),
    phone: Yup.string()
      .min(9, "Please enter a valid phone number")
      .max(10, "Please enter a valid phone number")
      .matches(/^[0-9]*$/, "Please enter valid phone number")
      .required("Please enter phone number"),
    address: Yup.string().required("Please enter address"),
    postal_code: Yup.string().required("Please enter zip/postal code"),
    address2: Yup.string().required("Please enter address line 2"),
    state: Yup.string().required("Please enter state"),
    country: Yup.string().required("Please enter country"),
    customer_files: Yup.array().test(
      "customer_files",
      "Please select a valid file type.",
      file => {
        let fileArr = Array.from(file);

        if (
          fileArr.every(x =>
            ["pdf", "doc", "docx", "csv"].includes(
              x.name
                .split(".")
                .pop()
                .toLowerCase()
            )
          )
        ) {
          return true;
        } else {
          return false;
        }
      }
    ),
    customer_images: Yup.array().test(
      "customer_images",
      "Please select a image file type.",
      file => {
        let fileArr = Array.from(file);

        if (
          fileArr.every(x =>
            ["jpg", "jpeg", "png", "webp", "gif"].includes(
              x.name
                .split(".")
                .pop()
                .toLowerCase()
            )
          )
        ) {
          return true;
        } else {
          return false;
        }
      }
    )
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    postal_code: "",
    city: "",
    state: "",
    address2: "",
    customer_files: [],
    customer_images: [],
    group_id: undefined,
    status_id: undefined,
    customer_type_id: undefined,
    service_type_id: undefined,
    repeat_customer_id: undefined,
    customer_find_us_id: undefined,
    country: ""
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
