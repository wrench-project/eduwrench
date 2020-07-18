#ifndef ACTIVITY_WMS_H
#define ACTIVITY_WMS_H

#include <wrench-dev.h>

namespace wrench {

    class Simulation;

    class ActivityWMS : public WMS {
    public:
        ActivityWMS(const std::set<std::shared_ptr<StorageService>> &storage_services,
                    const std::string &hostname,
                    const std::shared_ptr<FileRegistryService> &file_registry_service);

    private:
        int main() override;
    };
};

#endif
