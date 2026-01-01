import { Link, useNavigate } from "react-router-dom";
import PlaylistProfile from "../components/PlaylistProfile";
import useAuthStore from "../store/useAuthStore";
import Ratings from "../components/Ratings";
import { Skeleton } from "../components/ui/skeleton";
import { ArrowLeft, Mail, User, Shield, Image, Edit, Award, TrendingUp, Calendar, Star, Zap, Target } from "lucide-react";
import ProblemSolvedByUser from "../components/ProblemSolvedByUser";
import ProfileSubmission from "../components/ProfileSubmission";
import { useEffect, useState } from "react";
import { useContestStore } from "../store/useContestStore";
import ContributionHeatmap from "../components/ContributionHeatmap";
import { SetPasswordModal } from "../components/GoogleAuth.example";

const ProfilePage = () => {
  const { authUser, isCheckingAuth } = useAuthStore();
  const navigate = useNavigate();
  const [contestRatings, setContestRatings] = useState([]);
  const [currentRating, setCurrentRating] = useState(null);
  const [currentRank, setCurrentRank] = useState(null);

  const { getUserContestRating } = useContestStore();
  useEffect(() => {
    getUserContestRating(authUser?.id)
      .then((ratings) => {
        if (ratings && ratings.length > 0) {
          setContestRatings(ratings);
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

  const handleClickEditProfile = () => {
    navigate("/edit-profile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-300 to-base-200 py-8 px-4 w-[99vw]">
      {/* Animated Header */}
      <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top duration-500">
        <div className="flex items-center gap-4">
          <Link 
            to={"/dashboard"} 
            className="btn btn-circle btn-ghost hover:bg-primary/20 hover:rotate-[-5deg] transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-5xl font-black text-base-content">
              Your Profile
            </h1>
            <p className="text-base-content/60 text-sm mt-1">Manage your coding journey</p>
          </div>
        </div>
      </div>

      {isCheckingAuth ? (
        <div className="flex gap-8 w-full">
          <div className="w-[35%]">
            <Skeleton className="h-[600px] w-full rounded-3xl" />
          </div>
          <div className="w-[65%] space-y-6">
            <Skeleton className="h-[300px] w-full rounded-3xl" />
            <Skeleton className="h-[400px] w-full rounded-3xl" />
          </div>
        </div>
      ) : (
        <div className="flex gap-8 w-full">
          {/* Left Sidebar - Profile Card */}
          <div className="w-[35%] animate-in slide-in-from-left duration-700">
            <div className="card bg-gradient-to-br from-base-100 via-base-100 to-base-200 shadow-2xl border-2 border-primary/20 backdrop-blur-xl sticky top-8 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all duration-500 hover:scale-[1.02]">
              <div className="card-body p-8">
                {/* Premium Avatar Section */}
                <div className="flex flex-col items-center gap-6 mb-6 relative">
                  {/* Glow effect behind avatar */}
                  <div className="absolute top-0 w-40 h-40 bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
                  
                  <div className="relative group z-10">
                    <div className="avatar">
                      <div className="w-40 h-40 rounded-full ring-4 ring-primary ring-offset-base-100 ring-offset-4 group-hover:ring-secondary group-hover:ring-offset-8 transition-all duration-500 group-hover:scale-110 shadow-2xl">
                        {authUser.image ? (
                          <img
                            src={authUser?.image || "https://avatar.iran.liara.run/public/boy"}
                            alt={authUser.name}
                            className="object-cover"
                          />
                        ) : (
                          <div className="bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                            <span className="text-6xl font-black text-white drop-shadow-lg">
                              {authUser.name ? authUser.name.charAt(0) : "U"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button className="absolute bottom-2 right-2 btn btn-circle btn-primary shadow-lg opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300">
                      <Image className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <h2 className="text-3xl font-bold text-base-content">
                      {authUser.name}
                    </h2>
                    <div className="badge badge-lg badge-primary gap-2 shadow-lg hover:scale-110 transition-transform">
                      <Shield className="w-4 h-4" />
                      {authUser.role}
                    </div>
                  </div>
                </div>

                <div className="divider divider-primary"></div>

                {/* Quick Stats with Glassmorphism */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="stat bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm rounded-2xl p-4 border border-primary/30 hover:scale-105 hover:shadow-xl transition-all duration-300">
                    <div className="stat-title text-xs font-semibold">Rating</div>
                    <div className="stat-value text-3xl font-black text-primary drop-shadow-lg">
                      {currentRating || "-"}
                    </div>
                    <div className="stat-desc flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Current
                    </div>
                  </div>
                  <div className="stat bg-gradient-to-br from-success/20 to-success/10 backdrop-blur-sm rounded-2xl p-4 border border-success/30 hover:scale-105 hover:shadow-xl transition-all duration-300">
                    <div className="stat-title text-xs font-semibold">Rank</div>
                    <div className="stat-value text-3xl font-black text-success drop-shadow-lg">
                      {currentRank ? `#${currentRank}` : "-"}
                    </div>
                    <div className="stat-desc flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Elite
                    </div>
                  </div>
                </div>

                {/* Info Cards with Icons */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-4 p-4 bg-base-200/50 backdrop-blur-sm rounded-2xl border border-base-300 hover:bg-primary/10 hover:border-primary/40 hover:scale-[1.02] transition-all duration-300 group">
                    <div className="p-3 bg-primary/20 rounded-xl group-hover:bg-primary group-hover:rotate-12 transition-all duration-300">
                      <Mail className="w-6 h-6 text-primary group-hover:text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-base-content/60 font-semibold uppercase tracking-wider">Email</p>
                      <p className="text-sm font-bold truncate">{authUser.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-base-200/50 backdrop-blur-sm rounded-2xl border border-base-300 hover:bg-success/10 hover:border-success/40 hover:scale-[1.02] transition-all duration-300 group">
                    <div className="p-3 bg-success/20 rounded-xl group-hover:bg-success group-hover:rotate-12 transition-all duration-300">
                      <User className="w-6 h-6 text-success group-hover:text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-base-content/60 font-semibold uppercase tracking-wider">User ID</p>
                      <p className="text-xs font-mono font-bold truncate">{authUser.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-base-200/50 backdrop-blur-sm rounded-2xl border border-base-300 hover:bg-warning/10 hover:border-warning/40 hover:scale-[1.02] transition-all duration-300 group">
                    <div className="p-3 bg-warning/20 rounded-xl group-hover:bg-warning group-hover:rotate-12 transition-all duration-300">
                      <Calendar className="w-6 h-6 text-warning group-hover:text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-base-content/60 font-semibold uppercase tracking-wider">Member Since</p>
                      <p className="text-sm font-bold">
                        {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    className="btn btn-primary w-full gap-2 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 text-base font-bold"
                    onClick={handleClickEditProfile}
                  >
                    <Edit className="w-5 h-5" />
                    Edit Profile
                  </button>
                  <button className="btn btn-outline btn-error w-full gap-2 hover:shadow-xl hover:scale-105 transition-all duration-300 text-base font-bold">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="w-[65%] space-y-6 animate-in slide-in-from-right duration-700">
            {/* Contest Performance Card */}
            <div className="card bg-gradient-to-br from-base-100 via-base-100 to-primary/5 shadow-2xl border-2 border-primary/20 backdrop-blur-xl hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:scale-[1.01] transition-all duration-500">
              <div className="card-body p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-xl">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-base-content">
                      Contest Performance
                    </h3>
                    <p className="text-base-content/60 text-sm">Track your competitive programming progress</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="stat bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-primary/30 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                    <div className="stat-figure text-primary">
                      <div className="p-3 bg-primary/20 rounded-xl">
                        <TrendingUp className="w-10 h-10" />
                      </div>
                    </div>
                    <div className="stat-title font-bold">Current Rating</div>
                    <div className="stat-value text-5xl font-black text-primary drop-shadow-lg">
                      {currentRating !== null ? currentRating : "-"}
                    </div>
                    <div className="stat-desc font-semibold flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      Keep improving!
                    </div>
                  </div>

                  <div className="stat bg-gradient-to-br from-success/20 to-success/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-success/30 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                    <div className="stat-figure text-success">
                      <div className="p-3 bg-success/20 rounded-xl">
                        <Target className="w-10 h-10" />
                      </div>
                    </div>
                    <div className="stat-title font-bold">Global Rank</div>
                    <div className="stat-value text-5xl font-black text-success drop-shadow-lg">
                      {currentRank !== null ? `#${currentRank}` : "-"}
                    </div>
                    <div className="stat-desc font-semibold flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Among all users
                    </div>
                  </div>
                </div>

                <Ratings contestRatings={contestRatings} />
              </div>
            </div>

            {/* Contribution Heatmap */}
            <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow-2xl border-2 border-base-300 backdrop-blur-xl hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:scale-[1.01] transition-all duration-500">
              <div className="card-body p-8">
                <ContributionHeatmap userId={authUser?.id} />
              </div>
            </div>

            {/* Problems Solved */}
            <div className="card bg-gradient-to-br from-base-100 to-success/5 shadow-2xl border-2 border-success/20 backdrop-blur-xl hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:scale-[1.01] transition-all duration-500">
              <div className="card-body p-8">
                <ProblemSolvedByUser />
              </div>
            </div>

            {/* Recent Submissions */}
            <div className="card bg-gradient-to-br from-base-100 to-secondary/5 shadow-2xl border-2 border-secondary/20 backdrop-blur-xl hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:scale-[1.01] transition-all duration-500">
              <div className="card-body p-8">
                <ProfileSubmission />
              </div>
            </div>

            {/* Playlists */}
            <div className="card bg-gradient-to-br from-base-100 to-accent/5 shadow-2xl border-2 border-accent/20 backdrop-blur-xl hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:scale-[1.01] transition-all duration-500">
              <div className="card-body p-8">
                <PlaylistProfile />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
