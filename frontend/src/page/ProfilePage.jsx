import { Link } from "react-router-dom";
import PlaylistProfile from "../components/PlaylistProfile";
import useAuthStore from "../store/useAuthStore";
import Ratings from "../components/Ratings";

import { ArrowLeft, Mail, User, Shield, Image } from "lucide-react";
import ProblemSolvedByUser from "../components/ProblemSolvedByUser";
import ProfileSubmission from "../components/ProfileSubmission";
import { useEffect, useState } from "react";
import { useContestStore } from "../store/useContestStore";

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const [contestRatings, setContestRatings] = useState([]);
  const [currentRating, setCurrentRating] = useState(null);
  const [currentRank, setCurrentRank] = useState(null);

  const { getUserContestRating } = useContestStore();
  useEffect(() => {
    // Fetch contest rating history for the user
    getUserContestRating(authUser?.id)
      .then((ratings) => {
        if (ratings && ratings.length > 0) {
          setContestRatings(ratings);
          // Set the current rating to the latest rating
          setCurrentRating(ratings[ratings.length - 1].rating);
          setCurrentRank(ratings[ratings.length - 1].rank ?? null);
        } else {
          setContestRatings([]);
          setCurrentRating(null);
          setCurrentRank(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching contest ratings:", error);
        setContestRatings([]);
        setCurrentRating(null);
        setCurrentRank(null);
      });
  }, [authUser?.id]);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center py-10 px-4   w-full">
      {/* Header with back button */}
      <div className="flex flex-row justify-between items-center w-full mb-6">
        <div className="flex items-center gap-3">
          <Link to={"/dashboard"} className="btn btn-circle btn-ghost">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-primary">Profile</h1>
        </div>
      </div>

      <div className="w-full  gap-10 justify-center-safe flex flex-row mx-auto">
        {/* Profile Card */}
        <div className="card left bg-base-100 h-full shadow-xl">
          <div className="card-body">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-24 h-24 ring ring-primary ring-offset-base-100 ring-offset-2">
                  {authUser.image ? (
                    <img
                      src={
                        authUser?.image ||
                        "https://avatar.iran.liara.run/public/boy"
                      }
                      alt={authUser.name}
                    />
                  ) : (
                    <span className="text-3xl">
                      {authUser.name ? authUser.name.charAt(0) : "U"}
                    </span>
                  )}
                </div>
              </div>

              {/* Name and Role Badge */}
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold">{authUser.name}</h2>
                <div className="badge badge-primary mt-2">{authUser.role}</div>
              </div>
            </div>

            <div className="divider"></div>

            {/* User Information */}
            <div className="flex flex-col gap-4">
              {/* Email */}
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-figure text-primary">
                  <Mail className="w-8 h-8" />
                </div>
                <div className="stat-title">Email</div>
                <div className="stat-value text-lg break-all">
                  {authUser.email}
                </div>
              </div>

              {/* User ID */}
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-figure text-primary">
                  <User className="w-8 h-8" />
                </div>
                <div className="stat-title">User ID</div>
                <div className="stat-value text-sm break-all">
                  {authUser.id}
                </div>
              </div>

              {/* Role Status */}
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-figure text-primary">
                  <Shield className="w-8 h-8" />
                </div>
                <div className="stat-title">Role</div>
                <div className="stat-value text-lg">{authUser.role}</div>
                <div className="stat-desc">
                  {authUser.role === "ADMIN"
                    ? "Full system access"
                    : "Limited access"}
                </div>
              </div>

              {/* Profile Image Status */}
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-figure text-primary">
                  <Image className="w-8 h-8" />
                </div>
                <div className="stat-title">Profile Image</div>
                <div className="stat-value text-lg">
                  {authUser.image ? "Uploaded" : "Not Set"}
                </div>
                <div className="stat-desc">
                  {authUser.image
                    ? "Image available"
                    : "Upload a profile picture"}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card-actions justify-end mt-6">
              <button className="btn btn-outline btn-primary">
                Edit Profile
              </button>
              <button className="btn btn-primary">Change Password</button>
            </div>
          </div>
        </div>

        
        {/* {proble solved by users} */}
        <div className="right flex flex-col gap-8 w-[60%]">

          <div>
             {/* Contest Ratings Section */}
          <div className="mt-8 flex gap-10">
            <h3 className="text-xl font-bold mb-2 text-primary">
              Contest Rating
            </h3>
            <div className="flex items-center gap-8 mb-4">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-success">
                  {currentRating !== null ? currentRating : "-"}
                </span>
                <span className="text-base-content/70">Current Rating</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-primary">
                  {currentRank !== null ? `#${currentRank}` : "-"}
                </span>
                <span className="text-base-content/70">Current Rank</span>
              </div>
            </div>

          </div>
            <div>
              <Ratings contestRatings={contestRatings} />
            </div>
          </div>
          <div>
            <ProblemSolvedByUser />
          </div>

         

          {/* Submissions */}
          <div className="Submissions">
            <ProfileSubmission />
          </div>

          <div>
            <PlaylistProfile />
          </div>
        </div>
      </div>
      <div>{/* Contest Rating Section */}</div>

      {/* PLaylist created by the user and their actions */}
    </div>
  );
};

export default ProfilePage;
