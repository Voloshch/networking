import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, withRouter } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

const TabsLayout = ({ menuItems, match }) => {
    const fullUrlPath = useLocation();
    const { pathname } = fullUrlPath;
    const { path } = match;

    return (
        <Menu attached='top' tabular>
            {menuItems.map((item, key) =>
                <Menu.Item
                    key={key}
                    name={item.name}
                    active={pathname.includes(item.path)}
                >
                    <Link to={`${path}/${item.path}`} className="link">{item.name}</Link>
                </Menu.Item>
            )}
        </Menu>
    );
};

TabsLayout.propTypes = {
    match: PropTypes.any,
    menuItems: PropTypes.array
};

export default withRouter(TabsLayout);
