// @deno-types="https://deno.land/x/types/react/v16.13.1/react.d.ts"
import React from 'https://dev.jspm.io/react';

interface IUsers {
	users: { id: string; name: string; }[];
}

class ListUsers extends React.Component<IUsers> {
	render() {
		return (
			<ol>
				{this.props.users.map(user => (
					<li key={user.id}>{user.name}</li>
				))}
			</ol>
		);
	}
}

export default ListUsers;