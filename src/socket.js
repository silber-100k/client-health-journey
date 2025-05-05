"use client";

import { io } from "socket.io-client";

export const socket = io("192.168.147.68:3000");