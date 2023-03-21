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
    monthly_price: Yup.string()
      .matches(/^[0-9]*[.]{1}[0-9]{2}$/, "Please enter valid monthly price")
      .required("Please enter montlhy price"),
    yearly_price: Yup.string()
      .matches(/^[0-9]*[.]{1}[0-9]{2}$/, "Please enter valid yearly price")
      .required("Please enter yearly price"),
    monthly_package_features: Yup.string().required(
      "Please select monthly features"
    ),
    yearly_package_features: Yup.string().required(
      "Please select yearly features"
    )
  }),
  validateOnMount: true,
  mapPropsToValues: props => ({
    name: "",
    monthly_price: "0",
    yearly_price: "0"
  }),
  handleSubmit: values => {},
  displayName: "CustomValidationForm",
  enableReinitialize: true
});

export default formikEnhancer;
