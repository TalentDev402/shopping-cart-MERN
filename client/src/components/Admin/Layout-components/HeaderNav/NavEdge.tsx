import styled from '@emotion/styled';

type NavEdgeProps = {
	left?: boolean;
	right?: boolean;
  }

const NavEdge = styled.div<NavEdgeProps>(({left, right}) => {

	if (left) {
		return {
			display: 'flex',
		}
	}

	if (right) {
		return {
			marginLeft: 'auto',
			padding: '0 1rem',
			display: 'flex'
		}
	}

	return {}
})

export default NavEdge