import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .required("Please enter Name")
      .max(50)
      .matches(
        /^[a-zA-Z0-9][a-zA-Z0-9 ]*[a-zA-Z0-9]$/,
        "Please enter valid name"
      ),
    status: Yup.object().shape({
      value: Yup.string().matches(
        /(active|inactive)/,
        "Please select valid status"
      )
    })
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    name: "",
    status: { label: "Active", value: "active" }
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
