import React, { FC, useCallback, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useFormik } from 'formik';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
// import Logo from '../../../components/Logo';
import useDarkMode from '../../../hooks/useDarkMode';
import AuthContext from '../../../contexts/authContext';
import USERS, { getUserDataWithUsername } from '../../../common/data/userDummyData';
import Spinner from '../../../components/bootstrap/Spinner';
import Alert from '../../../components/bootstrap/Alert';
import { getAPI, postAPI } from '../../../service/apiInstance';
import { toast } from 'react-toastify';
import { errorToaster, successToaster } from '../../../utils/toaster';
// import Logo from '../../../assets/logos/logo.png'
import Logo from '../../../assets/logos/full-logo.png'

interface ILoginHeaderProps {
	isNewUser?: boolean;
}
type LoginHandlerType = {
	loginEmail: String;
	loginPassword: String
}
const LoginHeader: FC<ILoginHeaderProps> = ({ isNewUser }) => {
	if (isNewUser) {
		return (
			<>
				<div className='text-center h1 fw-bold mt-5'>Create Account,</div>
				<div className='text-center h4 text-muted mb-5'>Sign up to get started!</div>
			</>
		);
	}
	return (
		<>
			<div className='text-center h1 fw-bold mt-5'>Welcome,</div>
			<div className='text-center h4 text-muted mb-5'>Sign in to continue!</div>
		</>
	);
};
LoginHeader.defaultProps = {
	isNewUser: false,
};

interface ILoginProps {
	isSignUp?: boolean;
}
const Login: FC<ILoginProps> = ({ isSignUp }) => {
	const { setUser, setToken } = useContext(AuthContext);

	const { darkModeStatus } = useDarkMode();

	const [signInPassword, setSignInPassword] = useState<boolean>(false);
	const [singUpStatus, setSingUpStatus] = useState<boolean>(!!isSignUp);
	const navigate = useNavigate();

	const loginHandler = async (values: LoginHandlerType) => {
		try {
			const payload =
			{
				"email": values.loginEmail,
				"password": values.loginPassword
			}

			// console.log(values)
			const res = await postAPI('user/login', payload)
			console.log('resres', { res })
			if (res.data.success) {
				successToaster("Admin logged in successful!")
				navigate('/')
				setToken(res?.data?.data?.token)
				if (setUser) {
					setUser(res?.data?.data?.userId);
				}
			} else {
				errorToaster(res?.data?.message)
			}
		} catch (error) {
			errorToaster("Something went wrong! ")
		} finally {
			setIsLoading(false)
		}
	}

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			loginEmail: "",
			loginPassword: "",
		},
		validate: (values) => {
			const errors: { loginEmail?: string; loginPassword?: string } = {};

			if (!values.loginEmail) {
				errors.loginEmail = 'Required';
			}

			if (!values.loginPassword) {
				errors.loginPassword = 'Required';
			}

			return errors;
		},
		validateOnChange: false,
		onSubmit: (values) => {
			setIsLoading(true)
			// console.log("valuesvalues", { values })
			// if (setUser) {
			// 	setUser(values.loginEmail);
			// }
			loginHandler(values)

		},
	});

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleContinue = async (values: LoginHandlerType) => {
		setIsLoading(true);
		const res = await getAPI('/user/login', {
			values
		})
		// setTimeout(() => {
		// 	if (
		// 		!Object.keys(USERS).find(
		// 			(f) => USERS[f].username.toString() === formik.values.loginEmail,
		// 		)
		// 	) {
		// 		formik.setFieldError('loginEmail', 'No such user found in the system.');
		// 	} else {
		// 		setSignInPassword(true);
		// 	}
		// 	setIsLoading(false);
		// }, 1000);
	};

	return (
		<PageWrapper
			isProtected={false}
			title={singUpStatus ? 'Sign Up' : 'Login'}
			className={classNames({ 'bg-dark': !singUpStatus, 'bg-light': singUpStatus })}>
			<Page className='p-0'>
				<div className='row h-100 align-items-center justify-content-center'>
					<div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container'>
						<Card className='shadow-3d-dark' data-tour='login-page'>
							<CardBody>
								<div className='text-center my-5'>
									<Link
										to='/'
										className={classNames(
											'text-decoration-none  fw-bold display-2',
											{
												'text-dark': !darkModeStatus,
												'text-light': darkModeStatus,
											},
										)}
										aria-label='Facit'>
										{/* <Logo width={200} /> */}
										<img
											src={Logo} style={{
												height: "130px"
											}} />
									</Link>
								</div>
								<div
									className={classNames('rounded-3 d-flex justify-content-center', {
										'bg-l10-dark': !darkModeStatus,
										'bg-dark': darkModeStatus,
									})}>
									<div className='row row-cols-2 g-3 pb-3 px-3 mt-0'>
										<div className='col w-100'>
											<Button
												color={darkModeStatus ? 'light' : 'dark'}
												isLight={singUpStatus}
												className='rounded-1 w-100'
												size='lg'
											>
												Login
											</Button>
										</div>
									</div>
								</div>

								<LoginHeader isNewUser={singUpStatus} />

								<form className='row g-4'>
									<>
										<div className='col-12 '>
											<FormGroup
												id='loginEmail'
												isFloating
												label='Your email'
												className='my-2'
											>
												<Input
													autoComplete='Email'
													value={formik.values.loginEmail}
													isTouched={formik.touched.loginEmail}
													invalidFeedback={
														formik.errors.loginEmail
													}
													isValid={formik.isValid}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													onFocus={() => {
														formik.setErrors({});
													}}
												/>
											</FormGroup>
											<FormGroup
												id='loginPassword'
												isFloating
												label='Password'
											>
												<Input
													type='password'
													autoComplete='current-password'
													value={formik.values.loginPassword}
													isTouched={formik.touched.loginPassword}
													invalidFeedback={
														formik.errors.loginPassword
													}
													validFeedback='Looks good!'
													isValid={formik.isValid}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
												/>
											</FormGroup>
										</div>
										<div className='col-12'>
											<Button
												color='warning'
												className='w-100 py-3'
												isDisable={!formik.values.loginEmail}
												onClick={formik.handleSubmit}>
												{isLoading && (
													<Spinner isSmall inButton isGrow />
												)}
												Continue
											</Button>
										</div>
									</>
								</form>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};
Login.propTypes = {
	isSignUp: PropTypes.bool,
};
Login.defaultProps = {
	isSignUp: false,
};

export default Login;
