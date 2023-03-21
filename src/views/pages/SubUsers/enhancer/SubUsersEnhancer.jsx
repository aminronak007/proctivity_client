import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    username: Yup.string()
      .required("Please enter name")
      .max(50)
      .matches(/^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$/, "Please enter valid name"),
    email: Yup.string()
      .email("The email you have entered is invalid")
      .max(60)
      .required("Please enter email"),
    phone: Yup.string()
      .min(9, "Please enter a valid mobile number")
      .max(10, "Please enter a valid mobile number")
      .matches(/^[0-9]*$/, "Please enter valid mobile number")
      .required("Please enter mobile number"),
    role: Yup.string().required("Please enter role")
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    username: "",
    email: "",
    phone: "",
    role: ""
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
