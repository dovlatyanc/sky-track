import { createSlice } from '@reduxjs/toolkit'

interface IFlightActionState {
	isShowRoute: boolean
}

const initialState: IFlightActionState = {
	isShowRoute: true
}

const flightActionsSlice = createSlice({
	name: 'flight-actions',
	initialState,
	reducers: {
		toggleFlightRoute: state => {
			state.isShowRoute = !state.isShowRoute
		}
	}
})

export const { toggleFlightRoute } = flightActionsSlice.actions
export const flightActionsReducer = flightActionsSlice.reducer
