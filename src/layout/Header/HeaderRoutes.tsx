import React from 'react';
import { Route, Routes } from 'react-router-dom';
import headers from '../../routes/headerRoutes';
import DefaultHeader from '../../pages/_layout/_headers/DefaultHeader';
import DashboardHeader from '../../pages/_layout/_headers/DashboardHeader';

const HeaderRoutes = () => {
	console.log("headers",{headers})
	return (
		<>
		<DashboardHeader/>
		{/* <Routes>
			{headers.map((page) => (
				// eslint-disable-next-line react/jsx-props-no-spreading
				<Route key={page.path} {...page} />
			))}
		</Routes> */}
			</>
	);
};

export default HeaderRoutes;
