import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    currentpassword: Yup.string()
      .required("Please enter current password")
      .min(8, "The password must be 8 to 16 characters in length")
      .max(16, "The password must be 8 to 16 characters in length")
      .trim(),
    newpassword: Yup.string()
      .required("Please enter new password")
      .min(8, "The password must be 8 to 16 characters in length")
      .max(16, "The password must be 8 to 16 characters in length")
      .trim(),
    confirmpassword: Yup.string()
      .required("Please enter confirm password")
      .min(8, "The password must be 8 to 16 characters in length")
      .max(16, "The password must be 8 to 16 characters in length")
      .trim()
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    currentpassword: "",
    newpassword: "",
    confirmpassword: ""
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
