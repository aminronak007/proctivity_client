import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email("The email you have entered is invalid")
      .max(60)
      .trim()
      .required("Please enter email"),
    password: Yup.string()
      .min(8)
      .max(16)
      .trim()
      .required("Please enter password")
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    email: "",
    password: ""
  }),
  handleSubmit: () => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
