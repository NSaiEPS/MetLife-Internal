import React, { useState } from "react";
import styles from "./Register.module.css";
import axios from "../../api/axios";
import Input from '../common/Input'

const Register = () => {
     const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear errors on input change
        setErrors(prev => ({
            ...prev,
            [name]: ""
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        return newErrors;
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
 try {
      const data = {
        username: formData.username,
        password: formData.password,
      };
      setLoading(true);
      const res = await axios.post("users/login", data);
      if (res?.data?.success) {
        localStorage.setItem("authDetails", JSON.stringify(res?.data?.data));
        navigate("/");
      } else {
        message.error(res?.data?.message);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
        }
    };

    return (
        <div className={styles.container}>
            {/* LEFT SIDE - LOGIN FORM */}
            <form className={styles.formContainer} onSubmit={handleSubmit} noValidate>
                <div className={styles.topStrip}></div>
                <h1 className={styles.title}>Register for new account</h1>

                <Input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className={styles.input}
                    value={formData.username}
                    handleChange={handleChange}
                    errors ={errors.username}
                 errorClass   ={styles.error}
                />
                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className={styles.input}
                    value={formData.password}
                    handleChange={handleChange}
                    errors ={errors.password}
                 errorClass   ={styles.error}
                    
                />
                <div className={styles.linkRow}>
                    <a href="#" className={styles.link}>Forgot Username?</a>
                    <span>|</span>
                    <a href="/forget-password" className={styles.link}>Forgot Password?</a>
                </div>

                <div>
                    <button type="submit" className={styles.loginBtn}>Register</button>
                </div>

                <div className={styles.footerLinks}>
                    <span>
                        Already have an account? <a href="/login" className={styles.link}>Login</a>
                    </span>
                  
                </div>
            </form>

            {/* RIGHT SIDE - INFO SECTION */}
            <div className={styles.infoSection}>
                <h2 className={styles.infoTitle}>
                    At MetLife, protecting your information is a top priority.
                </h2>
                <p className={styles.infoText}>
                    You may have seen recent news coverage of customers of financial services companies falling victim to social engineering scams. Scammers impersonate a trusted company to convince their targets into revealing or handing over sensitive information such as insurance, banking or login credentials. This scamming can happen via text, email or websites set up to look like the trusted company.
                </p>
                <a href="#" className={styles.readMore}>Read More →</a>
            </div>
        </div>
    );
};

export default Register;
