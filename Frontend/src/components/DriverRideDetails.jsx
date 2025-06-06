            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Passengers</h3>
                {rideDetails.passengers.map((passenger, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{passenger.name}</p>
                        <p className="text-sm text-gray-500">Gender: {passenger.gender}</p>
                        <p className="text-sm text-gray-500">Phone: {passenger.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Seats: {passenger.seats}</p>
                        <p className="text-sm text-gray-500">Status: {passenger.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Passenger Information</h2>
                
                {rideDetails.passengers && rideDetails.passengers.length > 0 ? (
                  <div className="space-y-4">
                    {rideDetails.passengers.map((passenger, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800">{passenger.name}</p>
                            <p className="text-sm text-gray-500">Gender: {passenger.gender}</p>
                            <p className="text-sm text-gray-500">Phone: {passenger.phone}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Seats: {passenger.seats}</p>
                            <p className="text-sm text-gray-500">Status: {passenger.status}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No passengers have booked this ride yet.</p>
                )}
              </div>
            </div> 