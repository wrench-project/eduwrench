/**
 * Copyright (c) 2019-2021. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import ModulesList from "../components/modules_list"

const Modules = () => (
  <Layout>
    <Seo title="Modules" />
    <p>&nbsp;</p>
    <ModulesList />
    <br/><br/>
  </Layout>
)

export default Modules
