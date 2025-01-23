import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { complaintEndpoints } from "../apis";
import { setComplaint } from "../../slices/complaintSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
const { CREATE_COMPLAINT_API } = complaintEndpoints;
const {
  GET_ALL_MY_COMPLAINTS_API,
  DELETE_COMPLAINT_API,
  GET_ALL_RESOLVED_COMPLAINTS_API,
  GET_ALL_UNRESOLVED_COMPLAINTS_API,
  GET_ALL_COMPLAINTS_API,
  LIKE_COMPLAINT_API,
  DISLIKE_COMPLAINT_API,
  RESOLVE_COMPLAINT_API,
  GET_RECENT_COMPLAINT,
  GET_COMPLAINT_MOST_VOTE,
  GET_COMPLAINT_ID,
} = complaintEndpoints;

// cration of complains
export function ComplaintCreation(data, token) {
  return async (dispatch) => {
    // let result = null;
    // const dispatch = useDispatch();
    // Create a Toast notification to indicate that the process is loading
    const toastId = toast.loading("Creating Complaint...");
    console.log("Add Complaint API", data);
    // Try to make a POST request to the CREATE_COMPLAINT_API endpoint with the complaint data as the payload
    try {
      const response = await apiConnector("POST", CREATE_COMPLAINT_API, data, {
        // Set the Content-Type header to multipart/form-data if the complaint data includes files
        "Content-Type": "multipart/form-data",

        // Set the Authorization header to Bearer followed by the authentication token
        Authorization: `Bearer ${token}`,
      });

      const Complaintdata = response?.data;
      // Log the response data to the console
      // const ComplaintImage = response.complaint.img
      //   ? response.complaint.img
      //   : `https://api.dicebear.com/5.x/initials/svg?seed=}`;
      // dispatch(
      //   setComplaint({ ...response.complaint.img, img: ComplaintImage })
      // );
      console.log("CREATE COMPLAINT API RESPONSE............", response);

      // If the response data indicates that the operation was not successful, throw an error
      if (!Complaintdata?.sucesss) {
        throw new Error("Could Not Create Complaint");
      }

      // Display a Toast notification indicating that the complaint was created successfully
      toast.success(response.data.message);

      // Return the response data
      // result = Complaintdata?.data;
    } catch (error) {
      // Log the error to the console
      console.log("CREATE COMPLAINT API ERROR............", error);

      // Display a Toast notification indicating that the complaint could not be created
      toast.error(error.message);
    }
    // Return null
    toast.dismiss(toastId);
    // return result;
    // Dismiss the Toast notification
  };
}

//getting all complaints under specific user

export const fetchAllMyComplaints = async (token) => {
  let result = [];
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_MY_COMPLAINTS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("ALL MY COMPLAINTS API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch All Complaints");
    }
    result = response?.data?.complaints;
  } catch (error) {
    console.log("ALL MY COMPLAINTS API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// delete a complaint
export const deleteComplaint = async (data, token) => {
  const toastId = toast.loading("Loading...");
  console.log("INSIDE DELETE COMPLAINT API");
  try {
    const response = await apiConnector("DELETE", DELETE_COMPLAINT_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("DELETE Complaint API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Complaint");
    }
    toast.success("Complaint Deleted");
  } catch (error) {
    console.log("DELETE Complaint API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
};

// getting allComplaints from all user
export const fetchResolvedComplaintsAPI = async (token) => {
  const toastId = toast.loading("Loading...");
  let result = [];

  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_RESOLVED_COMPLAINTS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("Getting fetchResolvedComplaintAPI", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch RESOLVED Complaints");
    }

    result = response?.data?.allComplaint;
  } catch (error) {
    console.log("GET_ALL_RESOLVED_COMPLAINTS_API API ERROR............", error);
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
};
//getting all unresolved Complaint
export const fetchUnresolvedComplaintsAPI = async (token) => {
  const toastId = toast.loading("Loading...");
  let result = [];

  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_UNRESOLVED_COMPLAINTS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("response in fetching unresolved complaint", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch UNRESOLVED Complaints");
    }
    console.log("Getting unresolvedComplaintAPI", response);

    result = response?.data?.allComplaint;
  } catch (error) {
    console.log(
      "GET_ALL_UNRSOLVED_COMPLAINTS_API API ERROR............",
      error
    );
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
};

// getting all complaint

export const fetchAllComplaints = async (token) => {
  let result = [];
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("GET", GET_ALL_COMPLAINTS_API, null, {
      Authorization: `Bearer ${token}`,
    });
    console.log("ALL  COMPLAINTS API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch All Complaints");
    }
    result = response?.data?.allComplaint;
  } catch (error) {
    console.log("ALL COMPLAINTS API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const likeComplaint = async (complaintId, token) => {
  const toastId = toast.loading("Loading...");
  let success = false;
  let result = null;
  try {
    const response = await apiConnector(
      "PUT",
      LIKE_COMPLAINT_API,
      { complaintId },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("Like Complaint API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Like Complaint");
    }

    toast.success(response.data.message);
    success = true;
    result = response?.data;
  } catch (error) {
    success = false;
    console.log("Like Complaint API ERROR............", error);
    toast.error(error.response.data.message);
    return success;
  }
  toast.dismiss(toastId);
  return result;
};

export const dislikeComplaint = async (complaintId, token) => {
  const toastId = toast.loading("Loading...");
  let success = false;
  let result = null;
  try {
    const response = await apiConnector(
      "PUT",
      DISLIKE_COMPLAINT_API,
      { complaintId },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("Dislike Complaint API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Dislike Complaint");
    }

    toast.success(response.data.message);
    success = true;
    result = response?.data;
  } catch (error) {
    success = false;
    console.log("Dislike Complaint API ERROR............", error);
    toast.error(error.message);
    return success;
  }

  toast.dismiss(toastId);
  return result;
};

export const resolveComplaint = async (complaintId, token) => {
  const toastId = toast.loading("Loading...");
  let success = false;
  let result = null;

  try {
    const response = await apiConnector(
      "PUT",
      RESOLVE_COMPLAINT_API,
      { complaintId },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("Resolve Complaint API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Resolve the Complaint");
    }

    toast.success(response?.data?.message);
    success = true;
    result = response?.data;
  } catch (error) {
    success = false;
    console.log("Resolve Complaint API ERROR............", error);
    toast.error(error.message);
    // Instead of returning success directly, return an object with success property
    return success;
  }
  toast.dismiss(toastId);

  return result;
};
// fetc most recent
export const fetchMostRecentComplaints = async (token) => {
  const toastId = toast.loading("Loading...");
  let result = [];

  try {
    const response = await apiConnector(
      "GET",
      GET_RECENT_COMPLAINT, // Replace with your API endpoint
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("Getting fetchMostRecentComplaintsAPI", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Most Recent Complaints");
    }

    result = response?.data?.complaints;
  } catch (error) {
    console.log("GET_MOST_RECENT_COMPLAINTS_API API ERROR............", error);
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
};

// fetch most voted
export const fetchMostVotedComplaints = async (token) => {
  const toastId = toast.loading("Loading...");
  let result = [];

  try {
    const response = await apiConnector(
      "GET",
      GET_COMPLAINT_MOST_VOTE, // Replace with your API endpoint
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("Getting fetchMostVotedComplaintsAPI", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Most Voted Complaints");
    }

    result = response?.data?.mostVotedComplaints;
  } catch (error) {
    console.log("GET_MOST_VOTED_COMPLAINTS_API API ERROR............", error);
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
};

// get complaints by id
export const fetchComplaintById = async (complaintId, token) => {
  try {
    const response = await apiConnector(
      "GET",
      `http://localhost:4000/api/v1/complaint/getComplaintById/${complaintId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("Complaint by ID API RESPONSE: ", response);

    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Complaint by ID");
    }

    const complaint = response?.data?.complaint;
    return complaint;
  } catch (error) {
    console.error("Error fetching complaint by ID:", error);
    throw error;
  }
};

// adding comment to complaint
export const addCommentToComplaint = async (complaintId, comment, token) => {
  console.log("comment", comment);
  console.log("complaintId", complaintId);
  console.log("token in compleint", token);
  try {
    const response = await apiConnector(
      "POST",
      `http://localhost:4000/api/v1/complaint/${complaintId}/createComment`,
      { comment },
      {
        // headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        // },
      }
    );

    const data = response.data;

    console.log("Create Comment API Response: ", data);

    if (!data.success) {
      throw new Error("Failed to create comment");
    }
    toast.success(response.data.message);
    return data.createComment;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};
// getting comment to comaplint

export const getCommentsByComplaintId = async (complaintId, token) => {
  try {
    const response = await apiConnector(
      "GET",
      `http://localhost:4000/api/v1/complaint/${complaintId}/getComment`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could not fetch comments");
    }
    toast.success(response.data.message);
    return response.data.comment;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error; // Propagate the error to the caller
  }
};
