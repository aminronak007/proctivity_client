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
    country: Yup.string().required("Please enter country")
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
    group_id: undefined,
    status_id: undefined
  }),
  handleSubmit: values => {},
  displayName: "CustomEditValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
