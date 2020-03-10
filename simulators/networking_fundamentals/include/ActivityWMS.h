
#ifndef ACTIVITY_WMS_H
#define ACTIVITY_WMS_H

#include <wrench-dev.h>

namespace wrench {

    class Simulation;

    class ActivityWMS : public WMS {
    public:
        ActivityWMS(const std::set<std::shared_ptr<wrench::StorageService>> &storage_services,
                    const std::string &hostname);

    private:
        int main() override;

        std::shared_ptr<wrench::DataMovementManager> data_movement_manager;
    };
};

#endif

