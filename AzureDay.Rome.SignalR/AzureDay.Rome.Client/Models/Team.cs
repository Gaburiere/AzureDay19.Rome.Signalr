using System;
using System.Collections.Generic;

namespace AzureDay.Rome.Client.Models
{
    public class Team
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public IEnumerable<Player> Players { get; set; }

    }
}