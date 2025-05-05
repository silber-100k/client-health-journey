"use client";

import { io } from "socket.io-client";

export const socket = io("192.168.142.167:3000");