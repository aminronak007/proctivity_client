import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email("The email you have entered is invalid")
      .max(60)
      .trim()
      .required("Please enter email")
  }),
  mapPropsToValues: props => ({
    email: ""
  }),
  validateOnMount: true,
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
