import React, { useState } from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import { withFormik, Field, Form } from 'formik'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { auth, db } from '../../../firebase/Firebase'
import MyPasswordField from '../MyPasswordField'
import { SignUpYupValidation } from '../ValidationShchema'
import ForumTwoToneIcon from '@material-ui/icons/ForumTwoTone'


const SignUpPage = ({ setFieldValue, handleBlur, touched, errors, isSubmitting, status }) => {
    const [checked, setChecked] = useState(false)

    const handleChange = (event) => {
        setChecked(event.target.checked)
    }

    if (auth.currentUser !== null) return <Redirect to="/dashboard" />
    return (
        <div className={`signup-container`} >

            <div className="signup-form-container">
                <h1>OS-MESSENGER <ForumTwoToneIcon fontSize="large" color="primary" /></h1>

                <Form>

                    <Field as={TextField} type="Text" name="firstName" label="First Name"
                        error={touched.firstName && errors.firstName ? true : false}
                        helperText={touched.firstName ? errors.firstName : null}
                    />

                    <Field as={TextField} type="Text" name="lastName" label="Last Name"
                        error={touched.lastName && errors.lastName ? true : false}
                        helperText={touched.lastName ? errors.lastName : null}
                    />

                    <Field as={TextField} type="email" name="email" label="Email"
                        error={touched.email && errors.email ? true : false}
                        helperText={touched.email ? errors.email : null}
                    />

                    <Field as={TextField} type="Text" name="userName" label="Username"
                        error={touched.userName && errors.userName ? true : false}
                        helperText={touched.userName ? errors.userName : null}
                    />

                    <MyPasswordField
                        setFieldValue={setFieldValue} handleBlur={handleBlur}
                        error={touched.password && errors.password ? true : false}
                        errorMessage={errors.password}
                    />

                    <FormControlLabel
                        control={<Checkbox checked={checked} onChange={handleChange} name="robot" />}
                        label="I'm not a Robot"
                    />

                    <Field type="submit" as={Button} variant="contained" color="secondary" id="button" disabled={isSubmitting || !checked}>Join Now</Field>
                    {status && status.error && <small style={{ color: "red" }}>{status && status.error}</small>}
                </Form>

                <p>Already a User ? <NavLink to="/signin"><Button color="primary" size="small" >Log In</Button></NavLink></p>
            </div>

        </div>
    )
}
const FormikSignUpPage = withFormik({
    mapPropsToValues() {
        return {
            firstName: "",
            lastName: "",
            userName: "",
            email: "",
            password: ""
        }
    },

    validationSchema: SignUpYupValidation,

    handleSubmit(values, {props, setSubmitting, setStatus }) {
        const { firstName, lastName, email, password, userName } = values
        const { users } = props
        setSubmitting(true)
        setStatus({ loading: true })
    
        const usersNameArray = [] //array to hold all registered users usernames
        users.forEach(user => {
            const names = user.userName.toLowerCase()
            usersNameArray.push(names) 
        })
        
        //checking if current user username of choice already exists in the database
        if (usersNameArray.includes(userName.toLowerCase())) {
            setSubmitting(false)
            setStatus({ loading: false })
            setStatus({ error: "Username already taken by another user" })
        }
        else {

            auth.createUserWithEmailAndPassword(
                email,
                password
            )
                .then((res) => {
                    return db.collection("users").doc(res.user.uid).set({
                        firstName: firstName,
                        lastName: lastName,
                        name: firstName + " " + lastName,
                        password: password,
                        userName: userName,
                        favorites: [],
                        id: res.user.uid,
                        country: "",
                        state: "",
                        displayImage: "",
                        about: "",
                        isActive: true,
                        lastSeen : null
                    })

                }).then(() => {
                    setSubmitting(false)
                    setStatus({ loading: false })

                }).catch((error) => {
                    console.log(error)
                    setSubmitting(false)
                    setStatus({ loading: false })
                    setStatus({ error: error.message })
                })
        }

    }

})(SignUpPage)

export default FormikSignUpPage