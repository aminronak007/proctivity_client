import { withFormik } from "formik";
import * as Yup from "yup";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    notes: Yup.string().required("Please enter notes")
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    customer_id: "",
    user_id: "",
    notes: ""
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
