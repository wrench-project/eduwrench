/**
 * Copyright (c) 2020-2021. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
*/

#ifndef ACTIVITY_WMS_H
#define ACTIVITY_WMS_H

#include <wrench-dev.h>

namespace wrench {

    class Simulation;

    class ActivityWMS : public WMS {
    public:
        ActivityWMS(const std::shared_ptr<FileRegistryService> &file_registry,
                    const std::set<std::shared_ptr<NetworkProximityService>> &network_proximity, const std::set<std::shared_ptr<StorageService>> &storage_services,
                    const std::string &hostname);

    private:
        int main() override;
    };
};

#endif
