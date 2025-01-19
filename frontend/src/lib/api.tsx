import { API_URL } from "./config";
import { getCookie } from "./utils";

export async function googleOAuthFlow(access_token: string) {
  const res = await fetch(`${API_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ access_token }),
  });
  return await res.json();
}

export async function getProfile() {
  const access_token = getCookie("access_token");
  const res = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });
  return await res.json();
}


export async function getEvents(calendar_id: string, from: string, to: string) {
  const access_token = getCookie("access_token");
  const res = await fetch(`${API_URL}/events/${calendar_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });
  return await res.json();
}

export async function createEvent(event: any) {
  console.log("CREATE EVENT:" + JSON.stringify(event));
  const access_token = getCookie("access_token");
  const res = await fetch(`${API_URL}/events/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(event),
  });
  return await res.json();
}
export async function updateEvent(event: any) {
  console.log("THIOS: " + JSON.stringify(event));
  const access_token = getCookie("access_token");
  const res = await fetch(`${API_URL}/events/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(event),
  });
  return await res.json();
}

export async function deleteEvent(event_id: number) {
  const access_token = getCookie("access_token");
  const res = await fetch(`${API_URL}/${event_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });
  return await res.json();
}

// Not sure what arguments shld be passed
export async function getRecommendations(calendar_id: string) {
  const access_token = getCookie("access_token");
  const res = await fetch(`${API_URL}/events/recommend/${calendar_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return await res.json();
}

export async function updateRecommendations(info: any) {
  const access_token = getCookie("access_token");
  const res = await fetch(`${API_URL}/events/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(info),
  });
  return await res.json();
}

export async function getCalendars() {
  const access_token = getCookie("access_token");
  const res = await fetch(`${API_URL}/calendars`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });
  return await res.json();
}

export async function getCalendar(calendar_id: number) {
  const access_token = getCookie("access_token");
  const res = await fetch(`${API_URL}/calendars/${calendar_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    credentials: "include",
  });
  return await res.json();
}

// color, title, description
export async function createCalendar(calendar: any) {
  const access_token = getCookie("access_token");
  const res = await fetch(`${API_URL}/calendars/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(calendar),
  });
  return await res.json();
}

export async function updateCalendar(calendar: any) {
  const access_token = getCookie("access_token");
  const res = await fetch(
    `${API_URL}/calendars/update/${calendar["calendar_id"]}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({ calendar }),
    }
  );
  return await res.json();
}

export async function delCalendar(calendar_id: number) {
  const access_token = getCookie("access_token");

  const res = await fetch(`${API_URL}/calendars/${calendar_id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });
  return await res.json();
}

export async function postPersonality(finalProfile: any){
  const access_token = getCookie("access_token");
  const response = await fetch(`${API_URL}/users/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(finalProfile),
  });
  return await response.json();
}