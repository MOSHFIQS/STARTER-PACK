"use client";

import { useMeQuery, useLogoutMutation, useLoginMutation, useRegisterMutation, useChangePasswordMutation } from "@/redux/api/authApi";
import { useUpdateProfileMutation } from "@/redux/api/userApi";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setUser, setLoading, clearAuth } from "@/redux/slices/authSlice";
import { baseApi } from "@/redux/api/baseApi";

export function useAuth() {
     const dispatch = useAppDispatch();
     const { user: reduxUser, isAuthenticated, isLoading: reduxLoading, error: reduxError } = useAppSelector((state) => state.auth);
     const [mounted, setMounted] = useState(false);

     useEffect(() => {
          setMounted(true);
     }, []);

     const hasSession = mounted && typeof window !== "undefined" && document.cookie.includes("user_session");
     const { data: user, isLoading, error } = useMeQuery(undefined, { skip: !hasSession });


     useEffect(() => {
          if (mounted && !hasSession) {
               dispatch(clearAuth());
               return;
          }

          if (isLoading) {
               if (!reduxUser) {
                    dispatch(setLoading(true));
               }
          } else if (user) {
               dispatch(setUser(user));
               if (typeof window !== "undefined") {
                    const sessionData = { id: user.id, role: user.role, firstName: user.firstName, lastName: user.lastName };
                    document.cookie = `user_session=${encodeURIComponent(JSON.stringify(sessionData))}; path=/; max-age=604800;`;
               }
          } else if (error) {
               dispatch(clearAuth());
               if (typeof window !== "undefined") {
                    document.cookie = "user_session=; Max-Age=0; path=/;";
               }
          }
          // reduxUser intentionally omitted: including it re-triggers the effect on
          // logout (clearAuth changes reduxUser) while `user` is still cached, which
          // re-sets the user and the user_session cookie. Only react to the me query.
     }, [user, isLoading, error, dispatch, hasSession, mounted]);

     const [loginMutation] = useLoginMutation();
     const [registerMutation] = useRegisterMutation();
     const [logoutMutation] = useLogoutMutation();
     const [changePasswordMutation] = useChangePasswordMutation();
     const [updateProfileMutation] = useUpdateProfileMutation();

     const login = async (credentialsOrEmail: any, password?: string) => {
          let res;
          if (password !== undefined) {
               res = await loginMutation({ email: credentialsOrEmail, password }).unwrap();
          } else {
               res = await loginMutation(credentialsOrEmail).unwrap();
          }
          if (res && res.user) {
               // Update Redux state immediately so the navbar/sidebar update without
               // waiting for the /auth/me refetch.
               dispatch(setUser(res.user));
               if (typeof window !== "undefined") {
                    const sessionData = { id: res.user.id, role: res.user.role, firstName: res.user.firstName, lastName: res.user.lastName };
                    document.cookie = `user_session=${encodeURIComponent(JSON.stringify(sessionData))}; path=/; max-age=604800;`;
               }
          }
          return res;
     };

     const register = async (data: any) => {
          return await registerMutation(data).unwrap();
     };

     const logout = async () => {
          // 1) Clear Redux auth state immediately — navbar/sidebar update at once,
          //    no waiting on any network round trip.
          dispatch(clearAuth());

          // 2) Drop the user_session cookie right away so a reload can't restore it.
          if (typeof window !== "undefined") {
               document.cookie = "user_session=; Max-Age=0; path=/;";
          }

          // 3) Await the backend logout so the HttpOnly authToken cookie is cleared
          //    BEFORE we reset the cache. (authToken is HttpOnly, so only the server
          //    can delete it — see cookie.config.ts.)
          try {
               await logoutMutation().unwrap();
          } catch {
               // ignore — local state is already cleared
          }

          // 4) Wipe the entire RTK Query cache AFTER the backend cleared the token,
          //    so any subsequent /auth/me refetch returns 401 (not the stale user)
          //    and can never restore the session client-side.
          dispatch(baseApi.util.resetApiState());
     };

     const changePassword = async (currentPassword: string, newPassword: string) => {
          return await changePasswordMutation({ currentPassword, newPassword }).unwrap();
     };

     const updateProfile = async (data: any) => {
          return await updateProfileMutation(data).unwrap();
     };

     return {
          user: reduxUser,
          isAuthenticated,
          isLoading: reduxLoading,
          login,
          register,
          logout,
          changePassword,
          updateProfile,
          error: reduxError,
     };
}
export type AuthContextType = ReturnType<typeof useAuth>;
