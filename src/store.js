import { configureStore } from '@reduxjs/toolkit'
import  userSlice  from './slices/UserSlice'
export default configureStore({
  reducer: {
    userStoreData:userSlice
  }, 
})