
const validations = (values) => {
    const errors = {};

    if (values.firstName === " ") {
        errors.name = "firstName is required"
    }
};

export default validations;