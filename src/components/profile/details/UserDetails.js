import React from 'react'
import { withFormik, Form, Field } from 'formik'
import * as yup from 'yup'
import { db, auth } from '../../../firebase/Firebase'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'


const UserDetails = ({ isSubmitting, status, errors, touched }) => {
    const displayed = isSubmitting ? <CircularProgress color="primary" /> : <h3 style={{ color: 'green' }}>Updated</h3>
    return (
        <div className="users-profile-details">
            <Form className="users-profile-details-form" >

                <Field as={TextField} type="text" name="firstName" label="First Name" color="primary"
                    error={touched.firstName && errors.firstName ? true : false}
                    helperText={touched.firstName && errors.firstName}
                />

                <Field as={TextField} type="text" name="lastName" label="Last Name"
                    error={touched.lastName && errors.lastName ? true : false}
                    helperText={touched.lastName && errors.lastName}
                />

                <Field as={TextField} type="text" name="userName" label="Username" />
                <Field as={TextField} type="text" name="country" label="Country" />
                <Field as={TextField} type="text" name="state" label="State" />
                <Field as={TextField} type="text" name="about" label="About You" />

                <Field type="submit" as={Button} variant="contained" color="primary" disabled={isSubmitting} >Update Details</Field>
                {status && status.loading && displayed}
                {status && status.error && <small style={{color : "red"}}>{status.error}</small>}
            </Form>

        </div>
    )
}

const FormikUserDetails = withFormik({
    mapPropsToValues({ profile }) {
        const { firstName, lastName, about, country, state, userName } = profile
        return {
            firstName: firstName || "",
            lastName: lastName || "",
            userName: userName || "",
            country: country || "",
            state: state || "",
            about: about || "",
        }
    },

    validationSchema: yup.object().shape({
        firstName: yup.string()
            .required('Enter Firstname')
            .min(2, 'min of 2 letters'),

        lastName: yup.string()
            .required('Enter Lastname')
            .min(2, 'min of 2 letters'),

        userName: yup.string()
            .required('Enter Username')
            .min(2, 'min of 2 letters')
    }),

    handleSubmit(values, { setStatus, setSubmitting, props }) {
        const { country, firstName, lastName, about, state, userName } = values
        const { profile, users } = props
        const userId = auth.currentUser.uid

        setSubmitting(true)
        setStatus({ loading: true })

        const usersNameArray = []
        users.forEach(user => {
            const names = user.userName.toLowerCase()
            usersNameArray.push(names)
        })

        if (usersNameArray.includes(userName.toLowerCase()) && userName.toLowerCase() !== profile.userName.toLowerCase()) {
            setSubmitting(false)
            setStatus({ loading: false })
            setStatus({ error: 'Username already taken by another user' })
        }
        else {
            db.collection("users").doc(userId).update({
                firstName: firstName,
                lastName: lastName,
                name: firstName + " " + lastName,
                userName: userName,
                country: country,
                state: state,
                about: about

            }).then(() => {
                setSubmitting(false)
                setTimeout(() => {
                    setStatus({ loading: false })
                }, 1000)
                // console.log("Profile Updated")
            })
            .catch(err =>{
                setStatus({ error: err.message })
                setTimeout(() => {
                    setStatus({ loading: false })
                }, 1000)
            })
        }

    }

})(UserDetails)

export default FormikUserDetails