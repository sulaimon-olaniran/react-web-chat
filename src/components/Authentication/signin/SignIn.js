import React, { useState } from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import { withFormik, Field, Form } from 'formik'
import { SignInYupValidation } from '../ValidationShchema'
import MyPasswordField from '../MyPasswordField'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { auth } from '../../../firebase/Firebase'
import ForumTwoToneIcon from '@material-ui/icons/ForumTwoTone'


const SignInPage = ({ setFieldValue, handleBlur, touched, errors, isSubmitting, status }) => {
    const [checked, setChecked] = useState(false)
    const handleChange = (event) => {
        setChecked(event.target.checked)
    }

    if (auth.currentUser !== null) return <Redirect to="/dashboard" />
    return (
        <div className={`signin-container`}>
            <div className="signin-form-container">
            <h1>OS-MESSENGER <ForumTwoToneIcon fontSize="large" color="primary" /></h1>
                <Form >
                    <Field as={TextField} type="email" name="email" label="Email"
                        error={touched.email && errors.email ? true : false}
                        helperText={touched.email ? errors.email : null}
                    />
                    <MyPasswordField setFieldValue={setFieldValue} handleBlur={handleBlur}
                        error={touched.password && errors.password ? true : false}
                        errorMessage={errors.password}
                    />

                    <FormControlLabel
                        control={<Checkbox checked={checked} onChange={handleChange} name="jason" />}
                        label="I'm not a Robot"
                    />

                    <Field type="submit" as={Button} variant="contained" color="secondary" id="button" disabled={isSubmitting || !checked}>Sign In</Field>
                    {status && status.error && <small style={{ color: "red" }}>{status && status.error}</small>}
                </Form>
                <p>Don't have an account? <NavLink to="/signup"><Button color="primary" size="small">Sign Up</Button></NavLink></p>
            </div>

        </div>
    )
}

const FormikSignInPage = withFormik({
    mapPropsToValues() {
        return {
            email: "",
            password: ""
        }
    },

    validationSchema: SignInYupValidation,

    handleSubmit(values, { props, setStatus, setSubmitting }) {
        const { email, password } = values
        setSubmitting(true)
        setStatus({ loading: true })
        setStatus(true)

        auth.signInWithEmailAndPassword(email, password)
            .then((res) => {
               // analytics.logEvent('login')
                //console.log(res)
                setSubmitting(false)
                setTimeout(() => {
                   props.history.push('/dashboard')
                }, 1000)
            }).catch(err => {
                setSubmitting(false)
                console.log(err)
                setStatus({ loading: false })
                setStatus({ error: err.message })
            })

    }
})(SignInPage)

export default FormikSignInPage