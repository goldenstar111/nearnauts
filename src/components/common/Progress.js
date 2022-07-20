import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';


const Container = styled('div')`
	display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
	.progress {
		background-color: #d8d8d8;
		border-radius: 2px;
		position: relative;
		margin: 15px 0;
		height: 30px;
		width: -webkit-fill-available;
	}

	.progress-done {
		background: linear-gradient(to left, #F2709C, #FF9472);
		box-shadow: 0 3px 3px -5px #F2709C, 0 2px 5px #F2709C;
		border-radius: 2px;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 0;
		opacity: 0; 
		transition: 1s ease 0.3s;
	}

	.title {
		font-size: larger;
	}
`;

const Progress = ({done, items}) => {
	const [style, setStyle] = useState({});
	
	setTimeout(() => {
		const newStyle = {
			opacity: 1,
			width: `${done}%`
		}
		
		setStyle(newStyle);
	}, 200);
	
	return (
	<Container>
		<div className="progress">
			<div className="progress-done" style={style}>
				{done}%
			</div>
		</div>
		<div className="title">
		{items + ' of 7777 nauts are minted now.'}
		</div>
	</Container>
	)
}

export default Progress;