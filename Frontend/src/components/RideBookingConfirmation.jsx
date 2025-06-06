              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Your Booking Details</h3>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">Name: {bookingDetails.name}</p>
                      <p className="text-sm text-gray-500">Gender: {bookingDetails.gender}</p>
                      <p className="text-sm text-gray-500">Phone: {bookingDetails.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Seats: {bookingDetails.seats}</p>
                      <p className="text-sm text-gray-500">Status: {bookingDetails.status}</p>
                    </div>
                  </div>
                </div>
              </div> 