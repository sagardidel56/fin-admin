import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Icon from '../../components/icon/Icon';
// import Logo from '../../components/Logo';
import Logo from '../../assets/logos/logo.png'


interface IBrandProps {
	asideStatus: boolean;
	setAsideStatus(...args: unknown[]): unknown;
}
const Brand: FC<IBrandProps> = ({ asideStatus, setAsideStatus }) => {
	return (
		<div className='brand'>
			<div className='w-100 d-flex justify-content-center'>
				<div className='brand-logo'>
					<h1 className='brand-title '>
						<Link to='/' aria-label='Logo'>
							{/* <Logo height={32} /> */}
							<img
								src={Logo} style={{
									height: "64px"
								}} />
						</Link>
					</h1>
				</div>
			</div>
			<button
				type='button'
				className='btn brand-aside-toggle'
				aria-label='Toggle Aside'
				onClick={() => setAsideStatus(!asideStatus)}>
				<Icon icon='FirstPage' className='brand-aside-toggle-close' />
				<Icon icon='LastPage' className='brand-aside-toggle-open' />
			</button>
		</div>
	);
};
Brand.propTypes = {
	asideStatus: PropTypes.bool.isRequired,
	setAsideStatus: PropTypes.func.isRequired,
};

export default Brand;
