        <div className={`glass rounded-2xl p-6 mb-6 ${!isApproved ? "opacity-50 pointer-events-none" : ""}`}>
          <h3 className="font-bold mb-4">Connect Your Platforms</h3>

          <div className="flex gap-2 mb-6 border-b border-white/10 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab("whatsapp")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === "whatsapp" ? "bg-primary text-black" : "bg-white/5 text-white/60"
              }`}
            >
              <MessageCircle size={16} /> WhatsApp
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("facebook")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === "facebook" ? "bg-blue-500 text-white" : "bg-white/5 text-white/60"
              }`}
            >
              <Facebook size={16} /> Facebook
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("instagram")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === "instagram" ? "bg-pink-500 text-white" : "bg-white/5 text-white/60"
              }`}
            >
              <Instagram size={16} /> Instagram
            </button>
          </div>

          {activeTab === "whatsapp" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">WhatsApp Bot Status</span>
                {toggling === "waActive" ? <Loader2 className="animate-spin" size={20} /> : (
                  <input
                    type="checkbox"
                    checked={user.botConfig?.waActive || false}
                    onChange={() => toggleField("waActive", user.botConfig?.waActive || false)}
                    className="w-6 h-6 accent-teal-400 cursor-pointer"
                  />
                )}
              </div>
              {/* ඉතිරි Input fields එලෙසම පවතී */}
              <div>
                <label className="text-sm text-white/70 block mb-1.5">WhatsApp Number</label>
                <input type="text" value={form.waNumber} onChange={(e) => setForm({ ...form, waNumber: e.target.value })}
                  placeholder="+94712345678" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="text-sm text-white/70 block mb-1.5">Phone Number ID</label>
                <input type="text" value={form.waPhoneNumberId} onChange={(e) => setForm({ ...form, waPhoneNumberId: e.target.value })}
                  placeholder="From Meta Developer Console" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="text-sm text-white/70 block mb-1.5">Access Token</label>
                <input type="password" value={form.waAccessToken} onChange={(e) => setForm({ ...form, waAccessToken: e.target.value })}
                  placeholder="Permanent access token" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="text-sm text-white/70 block mb-1.5">Verify Token</label>
                <input type="text" value={form.waVerifyToken} onChange={(e) => setForm({ ...form, waVerifyToken: e.target.value })}
                  placeholder="Create your own (e.g. mybot123)" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-primary transition" />
              </div>
              <div className="bg-black/30 rounded-lg p-3 text-xs font-mono text-primary break-all mt-2">
                Webhook: https://bot-buisness-8jcc.vercel.app/api/webhook/whatsapp
              </div>
            </div>
          )}

          {activeTab === "facebook" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">Facebook Bot Status</span>
                {toggling === "fbActive" ? <Loader2 className="animate-spin" size={20} /> : (
                  <input
                    type="checkbox"
                    checked={user.botConfig?.fbActive || false}
                    onChange={() => toggleField("fbActive", user.botConfig?.fbActive || false)}
                    className="w-6 h-6 accent-blue-400 cursor-pointer"
                  />
                )}
              </div>
              <div>
                <label className="text-sm text-white/70 block mb-1.5">Facebook Page ID</label>
                <input type="text" value={form.fbPageId} onChange={(e) => setForm({ ...form, fbPageId: e.target.value })}
                  placeholder="From Meta Developer Console" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="text-sm text-white/70 block mb-1.5">Page Access Token</label>
                <input type="password" value={form.fbAccessToken} onChange={(e) => setForm({ ...form, fbAccessToken: e.target.value })}
                  placeholder="Page access token" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="text-sm text-white/70 block mb-1.5">Verify Token</label>
                <input type="text" value={form.fbVerifyToken} onChange={(e) => setForm({ ...form, fbVerifyToken: e.target.value })}
                  placeholder="Create your own" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-primary transition" />
              </div>
              <div className="bg-black/30 rounded-lg p-3 text-xs font-mono text-blue-400 break-all mt-2">
                Webhook: https://bot-buisness-8jcc.vercel.app/api/webhook/facebook
              </div>
            </div>
          )}

          {activeTab === "instagram" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">Instagram Bot Status</span>
                {toggling === "igActive" ? <Loader2 className="animate-spin" size={20} /> : (
                  <input
                    type="checkbox"
                    checked={user.botConfig?.igActive || false}
                    onChange={() => toggleField("igActive", user.botConfig?.igActive || false)}
                    className="w-6 h-6 accent-pink-400 cursor-pointer"
                  />
                )}
              </div>
              <div>
                <label className="text-sm text-white/70 block mb-1.5">Instagram Account ID</label>
                <input type="text" value={form.igAccountId} onChange={(e) => setForm({ ...form, igAccountId: e.target.value })}
                  placeholder="From Meta Developer Console" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="text-sm text-white/70 block mb-1.5">Access Token</label>
                <input type="password" value={form.igAccessToken} onChange={(e) => setForm({ ...form, igAccessToken: e.target.value })}
                  placeholder="Access token" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-primary transition" />
              </div>
              <div className="bg-black/30 rounded-lg p-3 text-xs font-mono text-pink-400 break-all mt-2">
                Webhook: https://bot-buisness-8jcc.vercel.app/api/webhook/instagram
              </div>
            </div>
          )}
        </div>
