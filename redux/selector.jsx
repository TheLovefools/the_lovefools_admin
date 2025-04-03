import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

export const createTypedSelector = (selector) => {
  return (state) => selector(state);
};

createTypedSelector.propTypes = {
  selector: PropTypes.func.isRequired,
};

export const useAppDispatch = () => useDispatch();

export const useAppSelector = useSelector;
