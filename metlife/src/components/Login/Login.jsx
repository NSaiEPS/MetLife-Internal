import React from "react";
import styles from "./Login.module.css";

const Login = () => {
    return (
        <div className={styles.container}>
            {/* LEFT SIDE - LOGIN FORM */}
            <div className={styles.formContainer}>
                <div className={styles.topStrip}></div>
                <h1 className={styles.title}>Log in to your account</h1>

                <input
                    type="text"
                    placeholder="Username"
                    className={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className={styles.input}
                />

                <div className={styles.linkRow}>
                    <a href="#" className={styles.link}>Forgot Username?</a>
                    <span>|</span>
                    <a href="#" className={styles.link}>Forgot Password?</a>
                </div>

                <div>
                    <button className={styles.loginBtn}>Log In</button>
                </div>

                <div className={styles.footerLinks}>
                    <span>
                        First-time user? <a href="#" className={styles.link}>Register Now</a>
                    </span>
                    <a href="#" className={styles.link}>I can’t log in</a>
                </div>
            </div>

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

export default Login;
