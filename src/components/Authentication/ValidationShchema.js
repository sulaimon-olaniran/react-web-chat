import * as yup from 'yup'

export const SignUpYupValidation = yup.object().shape({
    email: yup.string()
    .email('Invalid email')
    .required('Email is Required') ,

    password: yup.string()
    .required("Password is required")
    .min(8, "Min of 8 characters"),

    firstName: yup.string()
    .required('First Name is Required')
    .min(2, 'Min of 2 Letters'),
    //.matches('/^[a-z]+$/', "Name must be alphabets"),

    lastName : yup.string()
    .required('Last Name is Required')
    .min(2, 'Min of 2 letters'),
    //.matches('/^[a-z]+$/', "Name must be alphabets")

    userName : yup.string()
    .required("Username is Required")
    .min(4, 'Min of 4 letters')
})


export const SignInYupValidation = yup.object().shape({
    email: yup.string()
    .email('Invalid email')
    .required('Email is Required') ,

    password: yup.string()
    .required("Password is required")
    .min(8, "Min of 8 characters"),

    
})