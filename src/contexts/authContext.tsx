import React, { createContext, FC, ReactNode, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { getUserDataWithUsername, IUserProps } from '../common/data/userDummyData';
import { getAPIAuth, TOKEN_NAME } from '../service/apiInstance';

export interface IAuthContextProps {
	user: string;
	setUser?(...args: unknown[]): unknown;
	userData: Partial<IUserProps>;
	token: string;
	setToken(...args: unknown[]): unknown;
	setUserData(...args: unknown[]): unknown;
}
const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps);

interface IAuthContextProviderProps {
	children: ReactNode;
}
export const AuthContextProvider: FC<IAuthContextProviderProps> = ({ children }) => {
	const [user, setUser] = useState<string>(localStorage.getItem('fin_authUsername') || '');
	const [userData, setUserData] = useState<Partial<IUserProps>>({});
	const [token, setToken] = useState<string>(localStorage.getItem(TOKEN_NAME) || '');
	useEffect(() => {
		localStorage.setItem('fin_authUsername', user);
	}, [user]);

	const getProfileData = async () => {
		try {
			const res = await getAPIAuth('user/userDetails',"",setToken)
			if (res.data.success) {
				setUserData(res.data.data)
			}
		} catch (error) {

		}
	}

	useEffect(() => {
		localStorage.setItem(TOKEN_NAME, token);
		if (token) {
			getProfileData()
		}
	}, [token])

	useEffect(() => {
		if (user !== '') {
			setUserData(getUserDataWithUsername(user));
		} else {
			setUserData({});
		}
	}, [user]);

	const value = useMemo(
		() => ({
			user,
			setUser,
			userData,
			token,
			setToken,
			setUserData
		}),
		[user, userData],
	);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
AuthContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export default AuthContext;
