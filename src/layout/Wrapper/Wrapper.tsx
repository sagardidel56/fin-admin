import React, { FC, ReactNode, useContext } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Content from '../Content/Content';
import WrapperOverlay from './WrapperOverlay';
import HeaderRoutes from '../Header/HeaderRoutes';
import FooterRoutes from '../Footer/FooterRoutes';
import ThemeContext from '../../contexts/themeContext';
import AuthContext from '../../contexts/authContext';

interface IWrapperContainerProps {
	children: ReactNode;
	className?: string;
}
export const WrapperContainer: FC<IWrapperContainerProps> = ({ children, className, ...props }) => {
	const { rightPanel } = useContext(ThemeContext);
	return (
		<div
			className={classNames(
				'wrapper',
				{ 'wrapper-right-panel-active': rightPanel },
				className,
			)}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}>
			{children}
		</div>
	);
};
WrapperContainer.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};
WrapperContainer.defaultProps = {
	className: undefined,
};

const Wrapper = () => {
	const { token } = useContext(AuthContext);
	console.log({token})
	return (
		<>
			<WrapperContainer>
				{
					token ? (
						<HeaderRoutes />
					) : (
						<></>
					)
				}
				<Content />
				{
					token ? (
						<FooterRoutes />
					) : (
						<></>
					)
				}
			</WrapperContainer>
			<WrapperOverlay />
		</>
	);
};

export default Wrapper;
