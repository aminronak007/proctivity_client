import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    newpassword: Yup.string()
      .min(8, "The password must be 8 to 16 characters in length")
      .max(16, "The password must be 8 to 16 characters in length")
      .trim()
      .required("Please enter new password"),
    confirmpassword: Yup.string()
      .min(8, "The password must be 8 to 16 characters in length")
      .max(16, "The password must be 8 to 16 characters in length")
      .trim()
      .required("Please enter confirm password")
  }),
  mapPropsToValues: props => ({
    newpassword: "",
    confirmpassword: ""
  }),
  validateOnMount: true,
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
