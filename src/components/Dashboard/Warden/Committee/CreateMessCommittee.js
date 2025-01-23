import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchResult,
  clearSearchResult,
} from "../../../../slices/profileSlice";
import { toast } from "react-hot-toast";
import {
  searchUserByRegistrationNumber,
  getMessCommittee,
} from "../../../../services/operations/messcommitteeAPI";
import UserDetailsComponent from "./CreateCommittee/UserDetails";

const SearchUser = () => {
  const dispatch = useDispatch();
  const { loading, searchResult } = useSelector((state) => state.profile);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const { token } = useSelector((state) => state.auth);
  const [showDetails, setShowDetails] = useState(false);
  const [messCommitte, setMessCommitte] = useState(null);
  const [fetchCommittee, setFetchCommittee] = useState(false);
  // useEffect(() => {
  //   console.log("inside useEffect of getCommitee");
  const getCommittee = async () => {
    try {
      const response = await getMessCommittee(token);
      if (response) {
        console.log("inside get commitee", response);
        setMessCommitte(response.committeDetails);
      } else {
        console.error("Error fetching commitee");
      }
    } catch (error) {
      console.error("Error fetching committee:", error);
    }
  };
  //   getCommittee();
  // }, [token]);
  console.log("commitee members", messCommitte);
  const handleSearch = async () => {
    dispatch(clearSearchResult()); // Clear previous search result
    console.log("reg no", registrationNumber);
    try {
      const response = await searchUserByRegistrationNumber(
        registrationNumber,
        token
      );
      // Dispatch success action
      console.log("response in handle search", response);
      dispatch(setSearchResult(response.userDetails));
      setShowDetails(false);
    } catch (error) {
      // Dispatch failure action
      toast.error("User has not been updated his profile");
      console.error("Error searching for user details:", error.message);
    }
  };
  useEffect(() => {
    if (fetchCommittee) {
      getCommittee();
      setFetchCommittee(false);
    }
  }, [fetchCommittee, token]);

  const handleShowCommittee = () => {
    // Set the fetchCommittee state to true when the button is clicked
    setFetchCommittee(true);
  };
  console.log("fetch commitee", fetchCommittee);

  const handleShowDetails = () => {
    setShowDetails(true);
  };
  console.log("search result", searchResult);
  return (
    <div className="flex flex-col  mt-20 gap-2">
      <div className="flex flex-row gap-4">
        <input
          type="text"
          value={registrationNumber}
          placeholder="Enter Registration Number"
          className="form-style"
          onChange={(e) => setRegistrationNumber(e.target.value)}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="font-semibold px-3 border-spacing-1 py-2 rounded-md bg-green-100"
        >
          Search
        </button>
      </div>
      {/* show details */}
      <div className="flex flex-col gap-2">
        {searchResult && (
          <button
            onClick={handleShowDetails}
            disabled={!searchResult}
            className="font-semibold px-3  w-fit border-spacing-1 py-2 rounded-md bg-yellow-100"
          >
            Show Details
          </button>
        )}
        {loading && <p>Loading...</p>}
        {searchResult && searchResult.length === 0 && (
          <div className="text-white p-2 font-semibold">
            Not Found or User not updated his/her details
          </div>
        )}
        {searchResult && searchResult.length > 0 && (
          <div className="text-white p-2 font-semibold">
            {loading && <p>Loading...</p>}
            {searchResult === null && (
              <div className="text-white p-2 font-semibold">Not Found</div>
            )}
            {searchResult && showDetails && (
              <div className="text-white p-2 font-semibold ">
                User found: {searchResult[0].firstName}
                {/* Add more details here based on the user object */}
                <div>
                  <UserDetailsComponent userDetails={searchResult[0]} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* show committe members */}
      <div>
        <button
          onClick={handleShowCommittee}
          className="font-semibold mt-4 text-white"
        >
          Show Committee Members
        </button>
        <h3 className="flex text-yellow-400 mt-4 flex-col">
          Committee Members :
        </h3>

        <ul className="text-purple-200 flex-col">
          {messCommitte && messCommitte[0]?.messMember ? (
            messCommitte[0].messMember.map((member) => (
              <li key={member._id} className="flex flex-row gap-3">
                <p>
                  {member.firstName} {member.lastName}
                </p>
                <p>{member?.registrationNumber}</p>
              </li>
            ))
          ) : (
            <li>
              <h3>Mess committee is not created yet!!!</h3>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchUser;
