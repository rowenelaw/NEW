import React, { useState } from 'react';
import { Award, Check, Copy, Flame, MapPin, Send, Trophy, Users } from 'lucide-react';
import {
  AMBASSADOR_IMAGE,
  ARMY_BADGES,
  FriendStreakPeer,
  HawkerLeaderEntry,
  INITIAL_FRIENDS_STREAK,
  INITIAL_HAWKER_LEADERBOARD,
} from '../data/glassesConfig';

interface EcosystemHubProps {
  onSelectBtsEdition: () => void;
}

export const EcosystemHub: React.FC<EcosystemHubProps> = ({ onSelectBtsEdition }) => {
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<'week' | 'all'>('week');
  const [leaderboard, setLeaderboard] = useState<HawkerLeaderEntry[]>(INITIAL_HAWKER_LEADERBOARD);
  const [selectedCentre, setSelectedCentre] = useState('Maxwell Food Centre');
  const [visitLogged, setVisitLogged] = useState(false);

  const [referralCopied, setReferralCopied] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');
  const [invitedFriends, setInvitedFriends] = useState<string[]>([]);

  const [userStreak, setUserStreak] = useState(14);
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [friends, setFriends] = useState<FriendStreakPeer[]>(INITIAL_FRIENDS_STREAK);
  const [nudgedId, setNudgedId] = useState<string | null>(null);

  const [equippedBadgeId, setEquippedBadgeId] = useState('army-pioneer');
  const [badges, setBadges] = useState(ARMY_BADGES);
  const [ambassadorImgError, setAmbassadorImgError] = useState(false);

  const referralCode = 'OWNDAYS-EVEN-77';
  const referralUrl = `https://evenrealities.com/ref/${referralCode}`;

  const sortedLeaderboard = [...leaderboard].sort((a, b) =>
    leaderboardPeriod === 'week'
      ? b.stallsVisitedWeek - a.stallsVisitedWeek || b.visitsWeek - a.visitsWeek
      : b.stallsVisitedAllTime - a.stallsVisitedAllTime || b.visitsAllTime - a.visitsAllTime
  );

  const handleLogHawkerVisit = () => {
    setLeaderboard((prev) =>
      prev.map((entry) =>
        entry.isCurrentUser
          ? {
              ...entry,
              stallsVisitedWeek: entry.stallsVisitedWeek + 1,
              stallsVisitedAllTime: entry.stallsVisitedAllTime + 1,
              visitsWeek: entry.visitsWeek + 1,
              visitsAllTime: entry.visitsAllTime + 1,
              favoriteCentre: selectedCentre,
            }
          : entry
      )
    );
    setVisitLogged(true);
    window.setTimeout(() => setVisitLogged(false), 1800);
  };

  const handleEquipBadge = (badgeId: string, badgeName: string) => {
    setEquippedBadgeId(badgeId);
    setLeaderboard((prev) =>
      prev.map((entry) =>
        entry.isCurrentUser ? { ...entry, badgeName } : entry
      )
    );
  };

  const handleCopyReferral = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referralUrl).catch(() => {});
    }
    setReferralCopied(true);
    window.setTimeout(() => setReferralCopied(false), 2000);
  };

  const handleInviteFriend = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = friendEmail.trim();
    if (!cleaned) return;
    setInvitedFriends((prev) => [cleaned, ...prev]);
    setFriendEmail('');
    setBadges((prev) =>
      prev.map((b) => (b.id === 'seven-star' ? { ...b, unlocked: true } : b))
    );
  };

  const handleDailyStreakCheckIn = () => {
    if (checkedInToday) return;
    setCheckedInToday(true);
    setUserStreak((s) => s + 1);
    setLeaderboard((prev) =>
      prev.map((entry) =>
        entry.isCurrentUser ? { ...entry, streakDays: entry.streakDays + 1 } : entry
      )
    );
  };

  const handleNudgeFriend = (id: string) => {
    setNudgedId(id);
    setFriends((prev) =>
      prev.map((f) => (f.id === id ? { ...f, checkedInToday: true, streakDays: f.streakDays + 1 } : f))
    );
    window.setTimeout(() => setNudgedId(null), 1800);
  };

  return (
    <div className="max-w-[1360px] mx-auto px-6 md:px-10">
      {/* Section: Emotion — BTS Global Brand Ambassador Editorial Showcase */}
      <section
        id="ambassador"
        className="py-16 md:py-24 border-t border-black/[0.08]"
        aria-labelledby="ambassador-heading"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden bg-[#EAEAE6] border border-black/[0.06] min-h-[320px]">
            {!ambassadorImgError ? (
              <img
                src={AMBASSADOR_IMAGE}
                alt="BTS Global Brand Ambassador wearing Even G2 matte titanium smart glasses"
                referrerPolicy="no-referrer"
                onError={() => setAmbassadorImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-10 text-center bg-gradient-to-br from-[#EAEAE6] to-[#D8D8D2]">
                <div>
                  <p className="font-display text-lg font-semibold text-[#141413]">
                    BTS × Even Realities
                  </p>
                  <p className="text-sm text-[#5A5A56] mt-1">
                    Global Brand Ambassador · Even G2 A in Matte Titanium Grey
                  </p>
                </div>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-6 text-white">
              <p className="text-[12px] text-white/80">Global Brand Ambassador Campaign</p>
              <p className="font-display text-[18px] font-semibold mt-0.5">
                BTS Wearing Even G2 A · Matte Titanium Grey
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between p-6 md:p-8 rounded-2xl bg-white border border-black/[0.07]">
            <div>
              <p className="text-[12px] font-medium text-[#6D28D9]">
                BTS × Even Realities · Global Brand Ambassador
              </p>
              <h2
                id="ambassador-heading"
                className="font-display text-[24px] md:text-[28px] font-semibold tracking-tight text-[#141413] mt-2 leading-[1.2]"
                style={{ textWrap: 'balance' }}
              >
                Worn on stage, backstage, and through every quiet moment.
              </h2>
              <p className="text-[14px] text-[#5A5A56] mt-4 leading-relaxed">
                Designed with BTS as our global brand ambassadors, Even G2 pairs invisible waveguide lyrics, live translation, and discreet fan-community ARMY Badges inside classic 36-gram eyewear.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-black/[0.08] space-y-4">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#5A5A56]">Ambassador Frame</span>
                <span className="font-medium text-[#141413]">Even G2 A · Grey</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#5A5A56]">Launch Price (20% Off)</span>
                <span className="font-mono-tech font-bold text-[#DC2626]">
                  <span className="line-through text-[#6B6B68] font-normal mr-1.5">$599</span>
                  $479
                </span>
              </div>
              <button
                type="button"
                onClick={onSelectBtsEdition}
                className="w-full h-11 rounded-xl bg-[#141413] hover:bg-[#2C2C2A] text-[#F7F7F5] font-display text-[13px] font-semibold transition-colors cursor-pointer"
              >
                Select Ambassador Frame (G2 A · Grey)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Identity, Status Leaderboard, ARMY Badges & Friends Streak */}
      <section
        id="community"
        className="py-16 md:py-24 border-t border-black/[0.08]"
        aria-labelledby="community-heading"
      >
        <div className="max-w-2xl mb-12">
          <h2
            id="community-heading"
            className="font-display text-[24px] md:text-[30px] font-semibold tracking-tight text-[#141413]"
            style={{ textWrap: 'balance' }}
          >
            Even App Ecosystem · Hawker Leaderboard, Streaks &amp; ARMY Badges
          </h2>
          <p className="text-[15px] text-[#5A5A56] mt-2 leading-relaxed">
            Pair your glasses with the Even Hawker Quest add-on app to track hawker stall discoveries, preserve daily Friend Streaks, unlock ARMY Badges, and invite friends through OWNDAYS.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Status: Most Frequent Visitor to Most Number of Hawker Stalls Leaderboard */}
          <div className="lg:col-span-7 p-6 md:p-8 rounded-2xl bg-white border border-black/[0.07] flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-black/[0.08]">
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-5 h-5 text-[#141413]" aria-hidden="true" />
                  <div>
                    <h3 className="font-display text-[18px] font-semibold text-[#141413]">
                      Hawker Stalls Explorer Leaderboard
                    </h3>
                    <p className="text-[12px] text-[#6B6B68]">
                      Ranked by unique hawker stalls visited &amp; total stall check-ins
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 p-1 bg-[#EFEFED] rounded-lg">
                  <button
                    type="button"
                    onClick={() => setLeaderboardPeriod('week')}
                    className={`px-3 py-1 text-[12px] font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      leaderboardPeriod === 'week'
                        ? 'bg-white text-[#141413] shadow-xs'
                        : 'text-[#5A5A56] hover:text-[#141413]'
                    }`}
                  >
                    This Week
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeaderboardPeriod('all')}
                    className={`px-3 py-1 text-[12px] font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      leaderboardPeriod === 'all'
                        ? 'bg-white text-[#141413] shadow-xs'
                        : 'text-[#5A5A56] hover:text-[#141413]'
                    }`}
                  >
                    All Time
                  </button>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="border-b border-black/[0.08] text-[11px] text-[#6B6B68]">
                      <th className="py-2.5 font-medium">Rank</th>
                      <th className="py-2.5 font-medium">Explorer &amp; Badge</th>
                      <th className="py-2.5 font-medium text-right">Unique Stalls</th>
                      <th className="py-2.5 font-medium text-right">Total Visits</th>
                      <th className="py-2.5 font-medium text-right">Streak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.06]">
                    {sortedLeaderboard.map((row, idx) => {
                      const stalls =
                        leaderboardPeriod === 'week'
                          ? row.stallsVisitedWeek
                          : row.stallsVisitedAllTime;
                      const visits =
                        leaderboardPeriod === 'week' ? row.visitsWeek : row.visitsAllTime;

                      return (
                        <tr
                          key={row.id}
                          className={row.isCurrentUser ? 'bg-[#F7F7F5] font-medium' : ''}
                        >
                          <td className="py-3.5 font-mono-tech text-[#141413]">
                            #{idx + 1}
                          </td>
                          <td className="py-3.5">
                            <div className="text-[#141413] flex items-center gap-2">
                              <span>{row.explorer}</span>
                              {row.isCurrentUser && (
                                <span className="text-[11px] text-[#15803D] font-semibold">
                                  (You)
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#6B6B68] mt-0.5">
                              {row.badgeName} · {row.favoriteCentre}
                            </div>
                          </td>
                          <td className="py-3.5 text-right font-mono-tech text-[#141413]">
                            {stalls} stalls
                          </td>
                          <td className="py-3.5 text-right font-mono-tech text-[#5A5A56]">
                            {visits}
                          </td>
                          <td className="py-3.5 text-right font-mono-tech text-[#15803D]">
                            {row.streakDays}d
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Interactive Hawker Check-in Bar */}
            <div className="mt-6 pt-5 border-t border-black/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-[12px] text-[#5A5A56] flex-1">
                <MapPin className="w-4 h-4 text-[#141413] shrink-0" aria-hidden="true" />
                <select
                  value={selectedCentre}
                  onChange={(e) => setSelectedCentre(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-black/15 bg-[#F7F7F5] text-[13px] text-[#141413]"
                >
                  <option>Maxwell Food Centre</option>
                  <option>Tiong Bahru Market</option>
                  <option>Old Airport Road</option>
                  <option>Lau Pa Sat</option>
                  <option>Chinatown Complex</option>
                </select>
              </label>

              <button
                type="button"
                onClick={handleLogHawkerVisit}
                className="h-10 px-4 rounded-lg bg-[#141413] hover:bg-[#2C2C2A] text-[#F7F7F5] text-[12px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {visitLogged ? 'Stall Visit Logged (+1)' : '+ Log Hawker Stall Visit'}
              </button>
            </div>
          </div>

          {/* Right Column: Own Identity (OWNDAYS Referral) + Stickiness (Friends Streak) */}
          <div className="lg:col-span-5 space-y-6">
            {/* OWNDAYS Bring a Friend Referral */}
            <div className="p-6 rounded-2xl bg-[#EFEFED] border border-black/[0.06] space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#141413]" aria-hidden="true" />
                  <h3 className="font-display text-[16px] font-semibold text-[#141413]">
                    OWNDAYS Bring a Friend Referral
                  </h3>
                </div>
                <span className="font-mono-tech text-[11px] font-medium text-[#15803D]">
                  $50 Credit Each
                </span>
              </div>

              <p className="text-[13px] text-[#5A5A56] leading-relaxed">
                Invite a friend to fit Even G2 at any OWNDAYS partner studio or online. Both of you receive $50 optical credit and unlock the 7-Star Collector ARMY Badge.
              </p>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-10 px-3 rounded-lg bg-white border border-black/10 flex items-center font-mono-tech text-[12px] text-[#141413] truncate">
                  {referralCode}
                </div>
                <button
                  type="button"
                  onClick={handleCopyReferral}
                  className="h-10 px-3.5 rounded-lg bg-[#141413] text-[#F7F7F5] text-[12px] font-medium inline-flex items-center gap-1.5 hover:bg-[#2C2C2A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {referralCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <form onSubmit={handleInviteFriend} className="flex items-center gap-2">
                <input
                  type="email"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  placeholder="friend@email.com"
                  aria-label="Friend email for OWNDAYS referral"
                  className="flex-1 h-10 px-3 rounded-lg bg-white border border-black/12 text-[13px] text-[#141413] focus:outline-none focus:border-[#141413]"
                />
                <button
                  type="submit"
                  className="h-10 px-3.5 rounded-lg border border-black/20 bg-white hover:bg-[#F7F7F5] text-[12px] font-semibold text-[#141413] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Invite</span>
                </button>
              </form>

              {invitedFriends.length > 0 && (
                <p className="text-[12px] text-[#15803D] font-medium">
                  Referral sent to {invitedFriends[0]} · 7-Star Collector Badge unlocked
                </p>
              )}
            </div>

            {/* Stickiness: Friends Streak in App */}
            <div className="p-6 rounded-2xl bg-white border border-black/[0.07] space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#DC2626]" aria-hidden="true" />
                  <h3 className="font-display text-[16px] font-semibold text-[#141413]">
                    Friends Streak in App
                  </h3>
                </div>
                <span className="font-mono-tech text-[14px] font-bold text-[#141413]">
                  {userStreak} Days
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                    const active = i < 6 || checkedInToday;
                    return (
                      <div
                        key={i}
                        className={`w-7 h-7 rounded-md font-mono-tech text-[11px] flex items-center justify-center border ${
                          active
                            ? 'bg-[#141413] text-[#F7F7F5] border-[#141413]'
                            : 'bg-[#F7F7F5] text-[#6B6B68] border-black/10'
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleDailyStreakCheckIn}
                  disabled={checkedInToday}
                  className={`h-8 px-3 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-colors ${
                    checkedInToday
                      ? 'bg-[#16A34A]/15 text-[#15803D] cursor-default'
                      : 'bg-[#16A34A] hover:bg-[#15803D] text-white cursor-pointer'
                  }`}
                >
                  {checkedInToday ? 'Checked In' : 'Check In Today'}
                </button>
              </div>

              <div className="divide-y divide-black/[0.06] border-t border-black/[0.06]">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="py-2.5 flex items-center justify-between gap-3 text-[12px]"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-[#141413] truncate">
                        {friend.name} ·{' '}
                        <span className="font-mono-tech text-[#15803D]">
                          {friend.streakDays}d streak
                        </span>
                      </div>
                      <div className="text-[11px] text-[#6B6B68] truncate">
                        {friend.lastStall}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNudgeFriend(friend.id)}
                      className="px-2.5 py-1 rounded-md border border-black/12 text-[11px] font-medium text-[#141413] hover:bg-[#EFEFED] whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {nudgedId === friend.id
                        ? 'Streak Boosted'
                        : friend.checkedInToday
                        ? 'High Five'
                        : 'Nudge'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recognition: ARMY Badges */}
        <div className="mt-8 p-6 md:p-8 rounded-2xl bg-[#EFEFED] border border-black/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-black/[0.08]">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-[#6D28D9]" aria-hidden="true" />
              <div>
                <h3 className="font-display text-[17px] font-semibold text-[#141413]">
                  ARMY Badges · Recognition &amp; Profile Crest
                </h3>
                <p className="text-[12px] text-[#5A5A56]">
                  Equip an unlocked badge to display on your Even HUD and Hawker Explorer Leaderboard entry.
                </p>
              </div>
            </div>
            <span className="font-mono-tech text-[12px] text-[#5A5A56]">
              {badges.filter((b) => b.unlocked).length} / {badges.length} Unlocked
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((badge) => {
              const equipped = equippedBadgeId === badge.id;
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-colors ${
                    equipped
                      ? 'bg-white border-[#141413]'
                      : badge.unlocked
                      ? 'bg-white/75 border-black/[0.07]'
                      : 'bg-[#E6E6E2] border-black/[0.05] opacity-75'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <svg
                        viewBox="0 0 32 32"
                        className="w-8 h-8"
                        fill="none"
                        aria-hidden="true"
                      >
                        <polygon
                          points="16,2 28,9 28,23 16,30 4,23 4,9"
                          stroke={badge.unlocked ? badge.accent : '#8C8C87'}
                          strokeWidth="2"
                          fill={badge.unlocked ? `${badge.accent}15` : 'transparent'}
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r="4"
                          fill={badge.unlocked ? badge.accent : '#8C8C87'}
                        />
                      </svg>
                      <span className="font-mono-tech text-[11px] text-[#5A5A56]">
                        {badge.unlocked ? 'Unlocked' : 'Locked'}
                      </span>
                    </div>
                    <h4 className="font-display text-[14px] font-semibold text-[#141413]">
                      {badge.name}
                    </h4>
                    <p className="text-[12px] text-[#5A5A56] mt-1 leading-snug">
                      {badge.criteria}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={!badge.unlocked}
                    onClick={() => handleEquipBadge(badge.id, badge.name)}
                    className={`mt-4 w-full h-9 rounded-lg text-[12px] font-medium transition-colors ${
                      equipped
                        ? 'bg-[#141413] text-[#F7F7F5]'
                        : badge.unlocked
                        ? 'bg-[#EFEFED] text-[#141413] hover:bg-[#E2E2DD] cursor-pointer'
                        : 'bg-black/5 text-[#6B6B68] cursor-not-allowed'
                    }`}
                  >
                    {equipped ? 'Equipped on Profile' : badge.unlocked ? 'Equip Badge' : 'Invite 1 Friend to Unlock'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
