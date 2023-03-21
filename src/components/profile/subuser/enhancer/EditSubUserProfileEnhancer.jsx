import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    username: Yup.string()
      .max(20)
      .matches(/^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$/, "Please enter valid username")
      .required("Please enter username"),
    email: Yup.string()
      .email("The Email Id you have entered is invalid")
      .max(60)
      .trim()
      .required("Please enter email"),
    phone: Yup.string()
      .min(9, "Please enter a valid mobile number")
      .max(10, "Please enter a valid mobile number")
      .matches(/^[0-9]*$/, "Please enter valid mobile number")
      .required("Please enter mobile number")
  }),
  mapPropsToValues: props => ({
    username: "",
    email: "",
    phone: ""
  }),
  handleSubmit: async values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
