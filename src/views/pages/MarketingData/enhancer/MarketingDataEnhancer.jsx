import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    value: Yup.string()
      .required("Please enter value")
      .max(50)
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    value: ""
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
