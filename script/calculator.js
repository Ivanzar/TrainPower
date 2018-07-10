function calculate()
{
    var accounts = $("textarea").val().split(",");
    var sum = 0;
    var out;

    golos.api.getAccountsAsync(accounts, function (err, result)
    {
        console.log(result);
        if (!err)
        {
            result.forEach(function (item)
            {
                sum += parseFloat(item.vesting_shares.split(' ')[0])
                        + parseFloat(item.received_vesting_shares.split(' ')[0])
                        - parseFloat(item.delegated_vesting_shares.split(' ')[0]);
            });
        } else
            console.error(err);

        if (sum === 0)
        {
            out = "Список участников введен неверно!";
            $("#out").html(out);
        } else
        {
            console.log(sum);
            golos.api.getDynamicGlobalProperties(function (err, result)
            {
                console.log(result);
                
                var totalShares = result.total_vesting_shares.split(' ')[0];
                var totoalFund = result.total_vesting_fund_steem.split(' ')[0];
                
                var out = totoalFund*(sum/totalShares);
                out *= 1000;
                out = Math.round(out);
                out /= 1000;
                
                $("#out").html("Общая сила: " + out + " GOLOS");
            });
        }

    });
}

