import React, { createContext } from 'react';

export const Web3Context = createContext();

const withContext = Component => props => {
    return <Web3Context.Consumer>{value => <Component {...value} {...props} />}</Web3Context.Consumer>
}
export default withContext